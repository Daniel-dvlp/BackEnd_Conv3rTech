const express = require("express");
const router = express.Router();
const saleController = require("../../controllers/products_sale/SaleController");
const saleMiddleware = require("../../middlewares/products_sale/SalesMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", permissionMiddleware("Venta de productos", "Ver"), saleController.getAllSales);
router.get(
  "/:id",
  permissionMiddleware("Venta de productos", "Ver"),
  saleMiddleware.getSaleByIdValidation,
  saleController.getSaleById
);
router.post(
  "/",
  permissionMiddleware("Venta de productos", "Crear"),
  saleMiddleware.createSaleValidation,
  saleController.createSale
);
router.put(
  "/:id",
  permissionMiddleware("Venta de productos", "Editar"),
  saleMiddleware.updateSaleValidation,
  saleController.updateSale
);
router.delete(
  "/:id",
  permissionMiddleware("Venta de productos", "Eliminar"),
  saleMiddleware.deleteSaleValidation,
  saleController.deleteSale
);
router.patch(
  "/:id/estado",
  permissionMiddleware("Venta de productos", "Editar"),
  saleMiddleware.changeSaleStateValidation,
  saleController.changeSaleState
);

module.exports = router;
