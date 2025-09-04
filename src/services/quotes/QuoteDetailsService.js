const QuoteDetailRepository = require('../../repositories/quotes/QuoteDetailRepository');

// ✅ Crear detalle de cotización
const createQuoteDetail = async (detail) => {
    return QuoteDetailRepository.createQuoteDetail(detail);
};

// ✅ Obtener todos los detalles
const getAllQuoteDetails = async () => {
    return QuoteDetailRepository.getAllQuoteDetails();
};

// ✅ Obtener detalles por cotización
const getDetailsByQuoteId = async (id_cotizacion) => {
    return QuoteDetailRepository.getDetailsByQuoteId(id_cotizacion);
};

// ✅ Obtener detalle por ID
const getQuoteDetailById = async (id) => {
    return QuoteDetailRepository.getQuoteDetailById(id);
};

// ✅ Actualizar detalle
const updateQuoteDetail = async (id, detail) => {
    return QuoteDetailRepository.updateQuoteDetail(id, detail);
};

// ✅ Eliminar detalle
const deleteQuoteDetail = async (id) => {
    return QuoteDetailRepository.deleteQuoteDetail(id);
};

module.exports = {
    createQuoteDetail,
    getAllQuoteDetails,
    getDetailsByQuoteId,
    getQuoteDetailById,
    updateQuoteDetail,
    deleteQuoteDetail
};
