const { validationResult } = require('express-validator');
const saleDetailService = require('../../services/products_sale/SaleDetailService');

// Crear detalle de venta
const createSaleDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const detail = await saleDetailService.createSaleDetail(req.body);
        res.status(201).json({
            message: 'Detalle de venta creado exitosamente',
            data: detail
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los detalles
const getAllSaleDetails = async (req, res) => {
    try {
        const details = await saleDetailService.getAllSaleDetails();
        if (details.length === 0) {
            return res.status(200).json({ message: 'No hay detalles de venta registrados', data: [] });
        }
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener detalle por ID
const getSaleDetailById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const detail = await saleDetailService.getSaleDetailById(req.params.id);
        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener detalles por ID de venta
const getSaleDetailsBySaleId = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const details = await saleDetailService.getSaleDetailsBySaleId(req.params.id_venta);
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar detalle
const updateSaleDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await saleDetailService.updateSaleDetail(req.params.id, req.body);
        res.status(201).json({ message: 'Detalle de venta actualizado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar detalle
const deleteSaleDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await saleDetailService.deleteSaleDetail(req.params.id);
        res.status(201).json({ message: 'Detalle de venta eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSaleDetail,
    getAllSaleDetails,
    getSaleDetailById,
    getSaleDetailsBySaleId,
    updateSaleDetail,
    deleteSaleDetail
};
