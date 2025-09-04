const { validationResult } = require('express-validator');
const quoteDetailService = require('../../services/quotes/QuoteDetailsService');

// ✅ Crear detalle de cotización
const createQuoteDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const detail = await quoteDetailService.createQuoteDetail(req.body);
        res.status(201).json({
            message: 'Detalle de cotización creado exitosamente',
            data: detail
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Obtener todos los detalles
const getAllQuoteDetails = async (req, res) => {
    try {
        const details = await quoteDetailService.getAllQuoteDetails();
        if (details.length === 0) {
            return res.status(200).json({ message: 'No hay detalles registrados', data: [] });
        }
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Obtener detalle por ID
const getQuoteDetailById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const detail = await quoteDetailService.getQuoteDetailById(req.params.id);
        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Obtener detalles por cotización
const getDetailsByQuoteId = async (req, res) => {
    try {
        const details = await quoteDetailService.getDetailsByQuoteId(req.params.id);
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Actualizar detalle
const updateQuoteDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await quoteDetailService.updateQuoteDetail(req.params.id, req.body);
        res.status(201).json({ message: 'Detalle de cotización actualizado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Eliminar detalle
const deleteQuoteDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await quoteDetailService.deleteQuoteDetail(req.params.id);
        res.status(201).json({ message: 'Detalle de cotización eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createQuoteDetail,
    getAllQuoteDetails,
    getQuoteDetailById,
    getDetailsByQuoteId,
    updateQuoteDetail,
    deleteQuoteDetail
};
