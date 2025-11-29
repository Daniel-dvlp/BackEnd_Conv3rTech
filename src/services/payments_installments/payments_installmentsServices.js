const Repository = require('../../repositories/payments_installments/payments_installmentsRepository');
const PagosAbonos = require('../../models/payments_installments/payments_installments');
const Project = require('../../models/projects/Project');

/**
 * Carga proyecto con cliente (para leer 'credito') dentro o fuera de transacción
 */
async function loadProjectWithClient(idProyecto, transaction) {
  const proyecto = await Project.findByPk(idProyecto, {
    include: [{ model: require('../../models/clients/Clients'), as: 'cliente', attributes: ['id_cliente', 'credito', 'nombre'] }],
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });
  return proyecto;
}

/**
 * Calcula el total pendiente del proyecto = costo_total_proyecto - sum(pagos aprobados)
 * Si se pasa transaction, bloquea filas relevantes para evitar carreras.
 */
async function calculateOutstanding(idProyecto, transaction) {
  // Bloquear proyecto para consistencia
  const proyecto = await loadProjectWithClient(idProyecto, transaction);
  if (!proyecto) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = 404;
    throw err;
  }
  const totalProyecto = Number(proyecto.costo_total_proyecto || 0);

  // Bloquear pagos aprobados y sumar en memoria
  const pagosAprobados = await PagosAbonos.findAll({
    where: { id_proyecto: idProyecto, estado: true },
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });
  const totalPagado = pagosAprobados.reduce((acc, r) => acc + Number(r.monto || 0), 0);
  const pendiente = Math.max(0, Number((totalProyecto - totalPagado).toFixed(2)));
  return { proyecto, totalProyecto, totalPagado, pendiente };
}

/**
 * Verifica reglas de negocio para agregar un pago al proyecto.
 * - Si cliente.credito === false: solo un pago aprobado y por el monto exacto pendiente
 * - Si cliente.credito === true: múltiples pagos, sin exceder el total
 */
async function canAddPayment(idProyecto, monto, transaction) {
  const { proyecto, pendiente } = await calculateOutstanding(idProyecto, transaction);
  const credito = !!proyecto?.cliente?.credito;

  if (pendiente <= 0) {
    const err = new Error('Proyecto ya liquidado');
    err.statusCode = 409;
    err.code = 'payments.already_settled';
    throw err;
  }

  if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) {
    const err = new Error('El monto debe ser un número positivo');
    err.statusCode = 400;
    err.code = 'payments.rule_violation';
    throw err;
  }

  const montoNum = Number(Number(monto).toFixed(2));

  if (!credito) {
    // No crédito: debe ser pago único y exacto
    const countApproved = await PagosAbonos.count({
      where: { id_proyecto: idProyecto, estado: true },
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined,
    });

    if (countApproved > 0) {
      const err = new Error('Este proyecto no permite múltiples pagos');
      err.statusCode = 409;
      err.code = 'payments.single_payment_required';
      throw err;
    }

    if (montoNum !== Number(pendiente)) {
      const err = new Error('El monto debe ser exactamente igual al saldo pendiente');
      err.statusCode = 409;
      err.code = 'payments.single_payment_required';
      throw err;
    }
  } else {
    // Con crédito: múltiples pagos, pero no exceder
    if (montoNum > pendiente) {
      const err = new Error('El monto excede el total pendiente');
      err.statusCode = 409;
      err.code = 'payments.over_total';
      throw err;
    }
  }

  return { credito, pendiente, proyecto };
}

/**
 * Crea pago con transacción y revalidación para evitar condiciones de carrera.
 * data: { id_proyecto, monto, metodo_pago, fecha?, estado? }
 */
const createPagoAbono = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Datos de pago/abono inválidos');
  }
  if (!data.id_proyecto) {
    const err = new Error('id_proyecto es obligatorio');
    err.statusCode = 400;
    throw err;
  }

  // Aceptar alias "monto_pagado" por compatibilidad, priorizando "monto"
  const monto = data.monto != null ? Number(data.monto) : Number(data.monto_pagado);
  const metodo = data.metodo_pago;

  const t = await PagosAbonos.sequelize.transaction();
  try {
    // Primera validación bajo locks
    await canAddPayment(data.id_proyecto, monto, t);

    // Crear pago
    const created = await PagosAbonos.create(
      {
        id_proyecto: data.id_proyecto,
        fecha: data.fecha || new Date(),
        monto: monto,
        metodo_pago: metodo,
        estado: data.estado !== undefined ? !!data.estado : true,
      },
      { transaction: t }
    );

    // Revalidar que no se excedió con este pago (defensa ante concurrencia)
    const { pendiente } = await calculateOutstanding(data.id_proyecto, t);
    if (pendiente < 0) {
      // Si quedó en negativo, revertir
      throw Object.assign(new Error('El monto excede el total del proyecto tras la creación'), {
        statusCode: 409,
        code: 'payments.over_total',
      });
    }

    await t.commit();
    return created;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Listado general o por proyecto (si se pasa projectId)
 */
const getAllPagosAbonos = async (filters = {}) => {
  if (filters.projectId) {
    return Repository.getPagosByProyecto(filters.projectId);
  }
  return Repository.getAllPagosAbonos();
};

const getPagoAbonoById = async (id) => {
  return Repository.getPagoAbonoById(id);
};

const searchPagosAbonos = async (term) => {
  return Repository.searchPagosAbonos(term);
};

const cancelPagoAbono = async (id, motivoAnulacion = null) => {
  if (!motivoAnulacion || typeof motivoAnulacion !== 'string' || motivoAnulacion.trim() === '') {
    const err = new Error('El motivo de anulación es obligatorio');
    err.statusCode = 400;
    throw err;
  }

  const cancelled = await Repository.cancelPagoAbono(id, motivoAnulacion);
  if (!cancelled) {
    const err = new Error('El pago/abono ya fue anulado o no existe');
    err.statusCode = 409;
    throw err;
  }
  return true;
};

/**
 * Actualizaciones de pagos NO permitidas por reglas de negocio.
 * Se admite únicamente: crear, listar, buscar, obtener por id, listar por proyecto y cancelar.
 */

module.exports = {
  // reglas/ayudas
  calculateOutstanding,
  canAddPayment,
  // casos de uso
  createPagoAbono,
  getAllPagosAbonos,
  getPagoAbonoById,
  searchPagosAbonos,
  cancelPagoAbono,
};


