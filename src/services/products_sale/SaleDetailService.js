const SaleDetailRepository = require('../../repositories/products_sale/SaleDetailRepository');

// Crear detalle de venta
const createSaleDetail = async (detail) => {
    return SaleDetailRepository.createSaleDetail(detail);
};

// Obtener todos los detalles
const getAllSaleDetails = async () => {
    return SaleDetailRepository.getAllSaleDetails();
};

// Obtener detalle por ID
const getSaleDetailById = async (id) => {
    return SaleDetailRepository.getSaleDetailById(id);
};

// Obtener detalles por ID de venta
const getSaleDetailsBySaleId = async (id_venta) => {
    return SaleDetailRepository.getSaleDetailsBySaleId(id_venta);
};

// Actualizar detalle
const updateSaleDetail = async (id, detail) => {
    return SaleDetailRepository.updateSaleDetail(id, detail);
};

// Eliminar detalle
const deleteSaleDetail = async (id) => {
    return SaleDetailRepository.deleteSaleDetail(id);
};

module.exports = {
    createSaleDetail,
    getAllSaleDetails,
    getSaleDetailById,
    getSaleDetailsBySaleId,
    updateSaleDetail,
    deleteSaleDetail
};
