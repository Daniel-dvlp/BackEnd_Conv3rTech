const { Op } = require('sequelize');
const PagosAbonos = require('../../models/payments_installments/payments_installments');

const createPagoAbono = async (pagoData) => {
    return PagosAbonos.create(pagoData);
};

const getAllPagosAbonos = async () => {
    return PagosAbonos.findAll({ order: [['fecha', 'DESC']] });
};

const getPagoAbonoById = async (id) => {
    return PagosAbonos.findByPk(id);
};

/**
 * Listar pagos/abonos por proyecto (ordenados por fecha DESC)
 * @param {number} idProyecto
 * @returns {Promise<Array>}
 */
const getPagosByProyecto = async (idProyecto) => {
    return PagosAbonos.findAll({
        where: { id_proyecto: idProyecto },
        order: [['fecha', 'DESC'], ['id_pago_abono', 'DESC']]
    });
};

/**
 * Sumar monto aprobado (estado=true) por proyecto
 * Usa la columna 'monto' definida en el modelo
 */
const getTotalPagadoActivoByProyecto = async (idProyecto) => {
    const result = await PagosAbonos.findOne({
        attributes: [
            [
                PagosAbonos.sequelize.fn(
                    'COALESCE',
                    PagosAbonos.sequelize.fn('SUM', PagosAbonos.sequelize.col('monto')),
                    0
                ),
                'total_pagado'
            ]
        ],
        where: { id_proyecto: idProyecto, estado: true },
        raw: true
    });

    const total = result ? result.total_pagado : 0;
    const numeric = Number(total);
    return Number.isFinite(numeric) ? numeric : 0;
};

const cancelPagoAbono = async (id, motivoAnulacion = null) => {
    const [affected] = await PagosAbonos.update(
        { 
            estado: false,
            motivo_anulacion: motivoAnulacion
        },
        { where: { id_pago_abono: id, estado: true } }
    );
    return affected > 0;
};

const searchPagosAbonos = async (term) => {
    const searchTerm = (term || '').trim();
    if (searchTerm.length === 0) {
        return getAllPagosAbonos();
    }

    const likeOperator = PagosAbonos.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

    const orConditions = [
        { metodo_pago: { [likeOperator]: `%${searchTerm}%` } },
    ];

    const parsedId = Number(searchTerm);
    if (!Number.isNaN(parsedId)) {
        orConditions.push({ id_pago_abono: parsedId });
        orConditions.push({ id_proyecto: parsedId });
        // id_venta no existe en el modelo actual; se elimina para evitar errores de columna
    }

    if (searchTerm.toLowerCase() === 'true' || searchTerm.toLowerCase() === 'false') {
        const boolValue = searchTerm.toLowerCase() === 'true';
        orConditions.push({ estado: boolValue });
    }

    return PagosAbonos.findAll({
        where: { [Op.or]: orConditions },
        order: [['fecha', 'DESC']]
    });
};

/**
 * Contar pagos aprobados (estado=true) para un proyecto.
 * Útil para validar si se permite un único pago cuando el cliente no tiene crédito.
 */
const countApprovedByProyecto = async (idProyecto) => {
    return PagosAbonos.count({
        where: { id_proyecto: idProyecto, estado: true }
    });
};

/**
 * Actualizar campos permitidos de un pago/abono
 * @param {number} id
 * @param {object} changes { fecha?, metodo_pago?, estado? }
 * @returns {Promise&lt;object|null&gt;}
 */
const updatePagoAbonoById = async (id, changes = {}) => {
  const allowed = {};
  if (changes.fecha !== undefined) allowed.fecha = changes.fecha;
  if (changes.metodo_pago !== undefined) allowed.metodo_pago = changes.metodo_pago;
  if (changes.estado !== undefined) allowed.estado = !!changes.estado;

  if (Object.keys(allowed).length === 0) {
    return getPagoAbonoById(id);
  }

  await PagosAbonos.update(allowed, { where: { id_pago_abono: id } });
  return getPagoAbonoById(id);
};
module.exports = {
    createPagoAbono,
    getAllPagosAbonos,
    getPagoAbonoById,
    getPagosByProyecto,
    getTotalPagadoActivoByProyecto,
    countApprovedByProyecto,
    cancelPagoAbono,
    searchPagosAbonos,
    updatePagoAbonoById,
};


