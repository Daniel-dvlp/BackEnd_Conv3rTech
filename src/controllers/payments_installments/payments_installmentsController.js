const Service = require('../../services/payments_installments/payments_installmentsServices');

// Helpers de respuesta uniforme
function ok(res, data, meta = {}, status = 200) {
  return res.status(status).json({ data, meta });
}

function err(res, error) {
  const status = error.statusCode || 400;
  const code = error.code || 'payments.rule_violation';
  return res.status(status).json({
    error: { code, message: error.message },
  });
}

// ================== Endpoints legacy (colección plana) ==================

const createPagoAbono = async (req, res) => {
  try {
    const created = await Service.createPagoAbono(req.body);
    return ok(res, created, { message: 'Pago/Abono creado' }, 201);
  } catch (error) {
    return err(res, error);
  }
};

const getAllPagosAbonos = async (req, res) => {
  try {
    const items = await Service.getAllPagosAbonos();
    return ok(res, items, { total: items.length }, 200);
  } catch (error) {
    return err(res, error);
  }
};

const getPagoAbonoById = async (req, res) => {
  try {
    const item = await Service.getPagoAbonoById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ error: { code: 'payments.not_found', message: 'Pago/Abono no encontrado' } });
    }
    return ok(res, item);
  } catch (error) {
    return err(res, error);
  }
};

const searchPagosAbonos = async (req, res) => {
  try {
    const items = await Service.searchPagosAbonos(req.params.term);
    return ok(res, items, { total: items.length });
  } catch (error) {
    return err(res, error);
  }
};

const cancelPagoAbono = async (req, res) => {
  try {
    const { motivo_anulacion } = req.body;
    await Service.cancelPagoAbono(req.params.id, motivo_anulacion);
    // Mantener 200 por compatibilidad en endpoint legacy
    return ok(res, { success: true }, { message: 'Pago/Abono anulado' }, 200);
  } catch (error) {
    return err(res, error);
  }
};

// ============== Endpoints anidados /projects/:projectId/payments ==============

const createProjectPayment = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    const payload = {
      id_proyecto: projectId,
      fecha: req.body.fecha,
      metodo_pago: req.body.metodo_pago,
      monto: req.body.monto ?? req.body.monto_pagado, // alias por compatibilidad
      estado: req.body.estado, // opcional
    };

    const created = await Service.createPagoAbono(payload);
    return ok(res, created, { message: 'Pago creado' }, 201);
  } catch (error) {
    return err(res, error);
  }
};

const listProjectPayments = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    const items = await Service.getAllPagosAbonos({ projectId });
    return ok(res, items, { total: items.length });
  } catch (error) {
    return err(res, error);
  }
};

const getProjectPayment = async (req, res) => {
  try {
    const payment = await Service.getPagoAbonoById(req.params.paymentId);
    if (!payment || Number(payment.id_proyecto || payment.projectId) !== Number(req.params.projectId)) {
      return res
        .status(404)
        .json({ error: { code: 'payments.not_found', message: 'Pago no encontrado' } });
    }
    return ok(res, payment);
  } catch (error) {
    return err(res, error);
  }
};


const deleteProjectPayment = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    const paymentId = Number(req.params.paymentId);

    // Validar pertenencia
    const existing = await Service.getPagoAbonoById(paymentId);
    if (!existing || Number(existing.id_proyecto || existing.projectId) !== projectId) {
      return res
        .status(404)
        .json({ error: { code: 'payments.not_found', message: 'Pago no encontrado' } });
    }

    const { motivo_anulacion } = req.body;
    // Si viene motivo en body (raro en DELETE pero posible) se usa, si no, uno por defecto
    const reason = motivo_anulacion || 'Eliminado desde gestión de proyecto';

    await Service.cancelPagoAbono(paymentId, reason);
    // 200 OK con mensaje para DELETE
    return res.status(200).json({ message: 'Pago anulado correctamente' });
  } catch (error) {
    return err(res, error);
  }
};

module.exports = {
  // legacy
  createPagoAbono,
  getAllPagosAbonos,
  getPagoAbonoById,
  searchPagosAbonos,
  cancelPagoAbono,
  // nested
  createProjectPayment,
  listProjectPayments,
  getProjectPayment,
  deleteProjectPayment,
};


