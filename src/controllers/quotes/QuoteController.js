const { validationResult } = require('express-validator');
const quoteService = require('../../services/quotes/QuoteService');
const quoteDetailService = require('../../services/quotes/QuoteDetailsService');

// ✅ Crear cotización con detalles
const createQuote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const quote = await quoteService.createQuote(req.body);

        // Obtener cotización con cliente y detalles
        const quoteWithDetails = await quoteService.getQuoteById(quote.id_cotizacion);

        res.status(201).json({
            message: 'Cotización registrada exitosamente',
            data: quoteWithDetails
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Obtener todas las cotizaciones
const getAllQuotes = async (req, res) => {
    try {
        const quotes = await quoteService.getAllQuotes();
        if (quotes.length === 0) {
            return res.status(200).json({ message: 'No hay cotizaciones registradas', data: [] });
        }
        res.status(200).json(quotes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Obtener cotización por ID
const getQuoteById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const quote = await quoteService.getQuoteById(req.params.id);
        res.status(200).json(quote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Actualizar cotización
const updateQuote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await quoteService.updateQuote(req.params.id, req.body);
        const updatedQuote = await quoteService.getQuoteById(req.params.id);
        res.status(200).json({ message: 'Cotización actualizada exitosamente', data: updatedQuote });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Eliminar cotización
const deleteQuote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await quoteService.deleteQuote(req.params.id);
        res.status(201).json({ message: 'Cotización eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Cambiar estado de cotización
const changeQuoteState = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedQuote = await quoteService.changeQuoteState(req.params.id, req.body.estado);
        res.status(200).json({ message: 'Estado de la cotización actualizado exitosamente', data: updatedQuote });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Obtener detalles de una cotización
const getQuoteDetails = async (req, res) => {
    try {
        const details = await quoteDetailService.getDetailsByQuoteId(req.params.id);
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    changeQuoteState,
    getQuoteDetails
};
