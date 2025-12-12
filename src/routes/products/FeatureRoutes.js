const express = require("express");
const router = express.Router();
const featureController = require("../../controllers/products/FeatureController");
const featureMiddleware = require("../../middlewares/products/FeatureMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", permissionMiddleware("Productos", "Ver"), featureController.getAllFeatures);
router.get(
  "/:id",
  permissionMiddleware("Productos", "Ver"),
  featureMiddleware.getFeatureByIdValidation,
  featureController.getFeatureById
);
router.post(
  "/",
  permissionMiddleware("Productos", "Crear"),
  featureMiddleware.createFeatureValidation,
  featureController.createFeature
);
router.put(
  "/:id",
  permissionMiddleware("Productos", "Editar"),
  featureMiddleware.updateFeatureValidation,
  featureController.updateFeature
);
router.delete(
  "/:id",
  permissionMiddleware("Productos", "Eliminar"),
  featureMiddleware.deleteFeatureValidation,
  featureController.deleteFeature
);

module.exports = router;
