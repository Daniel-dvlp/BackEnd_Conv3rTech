const express = require("express");
const router = express.Router();
const saleDetailController = require("../../controllers/products_sale/SaleDetailController");
const saleDetailMiddleware = require("../../middlewares/products_sale/SalesDetailsMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", permissionMiddleware("Venta de productos", "Ver"), saleDetailController.getAllSaleDetails);
router.get(
  "/:id",
  permissionMiddleware("Venta de productos", "Ver"),
  saleDetailMiddleware.getSaleDetailByIdValidation,
  saleDetailController.getSaleDetailById
);
router.post(
  "/",
  permissionMiddleware("Venta de productos", "Crear"),
  saleDetailMiddleware.createSaleDetailValidation,
  saleDetailController.createSaleDetail
);
router.put(
  "/:id",
  permissionMiddleware("Venta de productos", "Editar"),
  saleDetailMiddleware.updateSaleDetailValidation,
  saleDetailController.updateSaleDetail
);
router.delete(
  "/:id",
  permissionMiddleware("Venta de productos", "Eliminar"),
  saleDetailMiddleware.deleteSaleDetailValidation,
  saleDetailController.deleteSaleDetail
);

module.exports = router;
