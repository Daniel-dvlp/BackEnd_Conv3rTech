const express = require("express");
const router = express.Router();
const purchaseController = require("../../controllers/purchase/PurchaseController");
const {
  validateCreatePurchase,
  validateUpdatePurchase,
  validateChangeStatePurchase,
  validatePurchaseId,
} = require("../../middlewares/purchase/PurchaseValidations");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
//router.use(authMiddleware);

router.post("/", validateCreatePurchase, purchaseController.createPurchase);
router.get("/", purchaseController.getAllPurchases);
router.get("/:id", validatePurchaseId, purchaseController.getPurchaseById);
router.put("/:id", validateUpdatePurchase, purchaseController.updatePurchase);
router.delete("/:id", validatePurchaseId, purchaseController.deletePurchase);
router.patch(
  "/state/:id",
  validateChangeStatePurchase,
  purchaseController.changeStatePurchase
);

module.exports = router;
