const SaleDetail = require('../../models/products_sale/SaleDetails');
const Sale = require('../../models/products_sale/Sale');
const Product = require('../../models/products/Product');

// ✅ Crear detalle de venta
const createSaleDetail = async (detail) => {
    return SaleDetail.create(detail);
};

// ✅ Obtener todos los detalles
const getAllSaleDetails = async () => {
    return SaleDetail.findAll({
        include: [
            { model: Sale, as: 'venta' },
            { model: Product, as: 'producto' }
        ]
    });
};

// ✅ Obtener detalle por ID
const getSaleDetailById = async (id) => {
    return SaleDetail.findByPk(id, {
        include: [
            { association: 'venta' },
            { association: 'producto' }
        ]
    });
};

// ✅ Obtener detalles por venta
const getSaleDetailsBySaleId = async (id_venta) => {
    return SaleDetail.findAll({
        where: { id_venta },
        include: [{ association: 'producto' }]
    });
};

// ✅ Actualizar detalle
const updateSaleDetail = async (id, detail) => {
    return SaleDetail.update(detail, { where: { id_detalle: id } });
};

// ✅ Eliminar detalle
const deleteSaleDetail = async (id) => {
    return SaleDetail.destroy({ where: { id_detalle: id } });
};

module.exports = {
    createSaleDetail,
    getAllSaleDetails,
    getSaleDetailById,
    getSaleDetailsBySaleId,
    updateSaleDetail,
    deleteSaleDetail
};
