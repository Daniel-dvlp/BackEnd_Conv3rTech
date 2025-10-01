const express = require("express");
const router = express.Router();
const saleController = require("../../controllers/products_sale/SaleController");
const saleMiddleware = require("../../middlewares/products_sale/SalesMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", saleController.getAllSales);
router.get(
  "/:id",
  saleMiddleware.getSaleByIdValidation,
  saleController.getSaleById
);
router.post(
  "/",
  saleMiddleware.createSaleValidation,
  saleController.createSale
);
router.put(
  "/:id",
  saleMiddleware.updateSaleValidation,
  saleController.updateSale
);
router.delete(
  "/:id",
  saleMiddleware.deleteSaleValidation,
  saleController.deleteSale
);
router.patch(
  "/:id/estado",
  saleMiddleware.changeSaleStateValidation,
  saleController.changeSaleState
);

module.exports = router;
