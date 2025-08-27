const express = require('express');
const router = express.Router();
const featureController = require('../../controllers/products/FeatureController');
const featureMiddleware = require('../../middlewares/products/FeatureMiddleware');

router.get('/', featureController.getAllFeatures);
router.get('/:id', featureMiddleware.getFeatureByIdValidation, featureController.getFeatureById);
router.post('/', featureMiddleware.createFeatureValidation, featureController.createFeature);
router.put('/:id', featureMiddleware.updateFeatureValidation, featureController.updateFeature);
router.delete('/:id', featureMiddleware.deleteFeatureValidation, featureController.deleteFeature);

module.exports = router;
