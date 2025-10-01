const express = require("express");
const router = express.Router();
const saleDetailController = require("../../controllers/products_sale/SaleDetailController");
const saleDetailMiddleware = require("../../middlewares/products_sale/SalesDetailsMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", saleDetailController.getAllSaleDetails);
router.get(
  "/:id",
  saleDetailMiddleware.getSaleDetailByIdValidation,
  saleDetailController.getSaleDetailById
);
router.post(
  "/",
  saleDetailMiddleware.createSaleDetailValidation,
  saleDetailController.createSaleDetail
);
router.put(
  "/:id",
  saleDetailMiddleware.updateSaleDetailValidation,
  saleDetailController.updateSaleDetail
);
router.delete(
  "/:id",
  saleDetailMiddleware.deleteSaleDetailValidation,
  saleDetailController.deleteSaleDetail
);

module.exports = router;
