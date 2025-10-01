const express = require("express");
const router = express.Router();
const featureController = require("../../controllers/products/FeatureController");
const featureMiddleware = require("../../middlewares/products/FeatureMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", featureController.getAllFeatures);
router.get(
  "/:id",
  featureMiddleware.getFeatureByIdValidation,
  featureController.getFeatureById
);
router.post(
  "/",
  featureMiddleware.createFeatureValidation,
  featureController.createFeature
);
router.put(
  "/:id",
  featureMiddleware.updateFeatureValidation,
  featureController.updateFeature
);
router.delete(
  "/:id",
  featureMiddleware.deleteFeatureValidation,
  featureController.deleteFeature
);

module.exports = router;
