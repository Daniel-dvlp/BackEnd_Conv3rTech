const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products/ProductController');
const productMiddleware = require('../../middlewares/products/ProductMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productMiddleware.getProductByIdValidation, productController.getProductById);
router.post('/', productMiddleware.createProductValidation, productController.createProduct);
router.put('/:id', productMiddleware.updateProductValidation, productController.updateProduct);
router.delete('/:id', productMiddleware.deleteProductValidation, productController.deleteProduct);
router.patch('/:id/estado', productMiddleware.changeProductStateValidation, productController.changeStateProduct);

module.exports = router;