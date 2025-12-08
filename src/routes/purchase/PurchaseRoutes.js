const express = require("express");
const router = express.Router();
const purchaseController = require("../../controllers/purchase/PurchaseController");
const {
  validateCreatePurchase,
  validateUpdatePurchase,
  validateChangeStatePurchase,
  validatePurchaseId,
} = require("../../middlewares/purchase/PurchaseValidations");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.post("/", permissionMiddleware("Compras", "Crear"), validateCreatePurchase, purchaseController.createPurchase);
router.get("/", permissionMiddleware("Compras", "Ver"), purchaseController.getAllPurchases);
router.get("/:id", permissionMiddleware("Compras", "Ver"), validatePurchaseId, purchaseController.getPurchaseById);
router.put("/:id", permissionMiddleware("Compras", "Editar"), validateUpdatePurchase, purchaseController.updatePurchase);
router.delete("/:id", permissionMiddleware("Compras", "Eliminar"), validatePurchaseId, purchaseController.deletePurchase);
router.patch(
  "/state/:id",
  permissionMiddleware("Compras", "Editar"),
  validateChangeStatePurchase,
  purchaseController.changeStatePurchase
);

module.exports = router;
