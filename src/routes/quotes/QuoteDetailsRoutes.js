const express = require('express');
const router = express.Router();
const quoteDetailController = require('../../controllers/quotes/QuoteDetailsController');
const quoteDetailMiddleware = require('../../middlewares/quotes/QuoteDetailsMiddleware');

// ✅ Rutas de detalles de cotización
router.get('/', quoteDetailController.getAllQuoteDetails);
router.get('/:id', quoteDetailMiddleware.getQuoteDetailByIdValidation, quoteDetailController.getQuoteDetailById);
router.get('/cotizacion/:id', quoteDetailController.getDetailsByQuoteId);
router.post('/', quoteDetailMiddleware.createQuoteDetailValidation, quoteDetailController.createQuoteDetail);
router.put('/:id', quoteDetailMiddleware.updateQuoteDetailValidation, quoteDetailController.updateQuoteDetail);
router.delete('/:id', quoteDetailMiddleware.deleteQuoteDetailValidation, quoteDetailController.deleteQuoteDetail);

module.exports = router;
