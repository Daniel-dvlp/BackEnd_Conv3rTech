const { validationResult } = require('express-validator');
const saleService = require('../../services/products_sale/SaleService');
const saleDetailService = require('../../services/products_sale/SaleDetailService');

// Crear venta con detalles
const createSale = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const sale = await saleService.createSale(req.body);

        // Validar que la venta se creó correctamente
        if (!sale || !sale.id_venta) {
            throw new Error('Error al crear la venta: no se recibió un ID válido');
        }

        // Obtener venta con cliente y detalles
        let saleWithDetails;
        try {
            saleWithDetails = await saleService.getSaleById(sale.id_venta);
            
            // Validar que se encontró la venta
            if (!saleWithDetails) {
                throw new Error('Error al recuperar la venta creada');
            }
        } catch (getError) {
            console.error('Error al obtener venta con detalles:', getError);
            // Si falla obtener con detalles, al menos retornar la venta básica
            saleWithDetails = sale;
        }

        res.status(201).json({
            message: 'Venta registrada exitosamente',
            data: saleWithDetails
        });
    } catch (error) {
        console.error('Error al crear venta:', error);
        console.error('Stack trace:', error.stack);
        res.status(400).json({ message: error.message || 'Error interno del servidor' });
    }
};

// Obtener todas las ventas
const getAllSales = async (req, res) => {
    try {
        const sales = await saleService.getAllSales();
        if (sales.length === 0) {
            return res.status(200).json({ message: 'No hay ventas registradas', data: [] });
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener venta por ID
const getSaleById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const sale = await saleService.getSaleById(req.params.id);
        res.status(200).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar venta
const updateSale = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await saleService.updateSale(req.params.id, req.body);
        const updatedSale = await saleService.getSaleById(req.params.id);
        res.status(200).json({ message: 'Venta actualizada exitosamente', data: updatedSale });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar venta
const deleteSale = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await saleService.deleteSale(req.params.id);
        res.status(201).json({ message: 'Venta eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cambiar estado de venta (ej: Anular)
const changeSaleState = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedSale = await saleService.changeSaleState(req.params.id, req.body.estado);
        res.status(200).json({ message: 'Estado de la venta actualizado exitosamente', data: updatedSale });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener detalles de una venta
const getSaleDetails = async (req, res) => {
    try {
        const details = await saleDetailService.getSaleDetailsBySaleId(req.params.id);
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    changeSaleState,
    getSaleDetails
};
