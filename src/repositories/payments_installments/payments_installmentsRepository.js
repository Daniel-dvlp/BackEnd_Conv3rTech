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

const getTotalPagadoActivoByProyecto = async (idProyecto) => {
    const result = await PagosAbonos.findOne({
        attributes: [
            [PagosAbonos.sequelize.fn('COALESCE', PagosAbonos.sequelize.fn('SUM', PagosAbonos.sequelize.col('monto_pagado')), 0), 'total_pagado']
        ],
        where: { id_proyecto: idProyecto, estado: true }
    });
    const total = result?.get?.('total_pagado');
    return Number(total || 0);
};

const cancelPagoAbono = async (id) => {
    const [affected] = await PagosAbonos.update(
        { estado: false },
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
        orConditions.push({ id_venta: parsedId });
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

module.exports = {
    createPagoAbono,
    getAllPagosAbonos,
    getPagoAbonoById,
    getTotalPagadoActivoByProyecto,
    cancelPagoAbono,
    searchPagosAbonos
};


