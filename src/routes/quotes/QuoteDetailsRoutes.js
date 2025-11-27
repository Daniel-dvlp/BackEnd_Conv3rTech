const express = require("express");
const router = express.Router();
const quoteDetailController = require("../../controllers/quotes/QuoteDetailsController");
const quoteDetailMiddleware = require("../../middlewares/quotes/QuoteDetailsMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// ✅ Rutas de detalles de cotización
router.get("/", permissionMiddleware("Cotizaciones", "Leer"), quoteDetailController.getAllQuoteDetails);
router.get(
  "/:id",
  permissionMiddleware("Cotizaciones", "Leer"),
  quoteDetailMiddleware.getQuoteDetailByIdValidation,
  quoteDetailController.getQuoteDetailById
);
router.get("/cotizacion/:id", permissionMiddleware("Cotizaciones", "Leer"), quoteDetailController.getDetailsByQuoteId);
router.post(
  "/",
  permissionMiddleware("Cotizaciones", "Editar"),
  quoteDetailMiddleware.createQuoteDetailValidation,
  quoteDetailController.createQuoteDetail
);
router.put(
  "/:id",
  permissionMiddleware("Cotizaciones", "Editar"),
  quoteDetailMiddleware.updateQuoteDetailValidation,
  quoteDetailController.updateQuoteDetail
);
router.delete(
  "/:id",
  permissionMiddleware("Cotizaciones", "Eliminar"),
  quoteDetailMiddleware.deleteQuoteDetailValidation,
  quoteDetailController.deleteQuoteDetail
);

module.exports = router;
