const express = require("express");
const router = express.Router();
const quoteController = require("../../controllers/quotes/QuoteController");
const quoteMiddleware = require("../../middlewares/quotes/QuoteMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// ✅ Rutas de cotizaciones
router.get("/", permissionMiddleware("Cotizaciones", "Ver"), quoteController.getAllQuotes);
router.get(
  "/:id",
  permissionMiddleware("Cotizaciones", "Ver"),
  quoteMiddleware.getQuoteByIdValidation,
  quoteController.getQuoteById
);
router.post(
  "/",
  permissionMiddleware("Cotizaciones", "Crear"),
  quoteMiddleware.createQuoteValidation,
  quoteController.createQuote
);
router.put(
  "/:id",
  permissionMiddleware("Cotizaciones", "Editar"),
  quoteMiddleware.updateQuoteValidation,
  quoteController.updateQuote
);
router.delete(
  "/:id",
  permissionMiddleware("Cotizaciones", "Eliminar"),
  quoteMiddleware.deleteQuoteValidation,
  quoteController.deleteQuote
);
router.patch(
  "/:id/estado",
  permissionMiddleware("Cotizaciones", "Editar"),
  quoteMiddleware.changeQuoteStateValidation,
  quoteController.changeQuoteState
);

// ✅ Ruta adicional para traer detalles de una cotización
router.get("/:id/detalles", permissionMiddleware("Cotizaciones", "Ver"), quoteController.getQuoteDetails);

// ✅ Ruta para validar stock de productos
router.post("/validate-stock", permissionMiddleware("Cotizaciones", "Ver"), quoteController.validateStock);

module.exports = router;
