const Repository = require('../../repositories/payments_installments/payments_installmentsRepository');

const createPagoAbono = async (data) => {
    // Validaciones mínimas de negocio
    if (!data || typeof data !== 'object') {
        throw new Error('Datos de pago/abono inválidos');
    }
    if (data.monto_total == null || Number(data.monto_total) <= 0) {
        throw new Error('monto_total debe ser mayor a 0');
    }
    if (data.monto_pagado == null || Number(data.monto_pagado) <= 0) {
        throw new Error('monto_pagado debe ser mayor a 0');
    }
    if (Number(data.monto_pagado) > Number(data.monto_total)) {
        throw new Error('monto_pagado no puede ser mayor que monto_total');
    }
    // Validar contra saldo del proyecto si viene id_proyecto
    if (data.id_proyecto) {
        const totalPagado = await Repository.getTotalPagadoActivoByProyecto(data.id_proyecto);
        const saldoRestante = Number(data.monto_total) - Number(totalPagado);
        if (Number(data.monto_pagado) > saldoRestante) {
            const err = new Error('El monto_pagado excede el saldo restante del proyecto');
            err.statusCode = 409;
            throw err;
        }
    }

    return Repository.createPagoAbono(data);
};

const getAllPagosAbonos = async () => {
    return Repository.getAllPagosAbonos();
};

const getPagoAbonoById = async (id) => {
    return Repository.getPagoAbonoById(id);
};

const searchPagosAbonos = async (term) => {
    return Repository.searchPagosAbonos(term);
};

const cancelPagoAbono = async (id) => {
    const cancelled = await Repository.cancelPagoAbono(id);
    if (!cancelled) {
        const err = new Error('El pago/abono ya fue anulado o no existe');
        err.statusCode = 409;
        throw err;
    }
    return true;
};

module.exports = {
    createPagoAbono,
    getAllPagosAbonos,
    getPagoAbonoById,
    searchPagosAbonos,
    cancelPagoAbono
};


