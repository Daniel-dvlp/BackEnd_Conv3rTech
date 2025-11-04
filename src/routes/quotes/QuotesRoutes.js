const express = require("express");
const router = express.Router();
const quoteController = require("../../controllers/quotes/QuoteController");
const quoteMiddleware = require("../../middlewares/quotes/QuoteMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
//router.use(authMiddleware);

// ✅ Rutas de cotizaciones
router.get("/", quoteController.getAllQuotes);
router.get(
  "/:id",
  quoteMiddleware.getQuoteByIdValidation,
  quoteController.getQuoteById
);
router.post(
  "/",
  quoteMiddleware.createQuoteValidation,
  quoteController.createQuote
);
router.put(
  "/:id",
  quoteMiddleware.updateQuoteValidation,
  quoteController.updateQuote
);
router.delete(
  "/:id",
  quoteMiddleware.deleteQuoteValidation,
  quoteController.deleteQuote
);
router.patch(
  "/:id/estado",
  quoteMiddleware.changeQuoteStateValidation,
  quoteController.changeQuoteState
);

// ✅ Ruta adicional para traer detalles de una cotización
router.get("/:id/detalles", quoteController.getQuoteDetails);

// ✅ Ruta para validar stock de productos
router.post("/validate-stock", quoteController.validateStock);

module.exports = router;
