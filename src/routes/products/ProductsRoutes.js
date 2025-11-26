const express = require("express");
const router = express.Router();
const productController = require("../../controllers/products/ProductController");
const imageUploadController = require("../../controllers/products/ImageUploadController");
const productMiddleware = require("../../middlewares/products/ProductMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");
const { uploadProductImages } = require("../../config/cloudinary");

// Middleware de autenticación para todas las rutas
//router.use(authMiddleware);

router.get("/", productController.getAllProducts);

router.get(
  "/:id",
  productMiddleware.getProductByIdValidation,
  productController.getProductById
);

// Crear producto - permite hasta 4 imágenes
router.post(
  "/",
  uploadProductImages.array('fotos', 4), // Acepta hasta 4 imágenes con el campo 'fotos'
  productMiddleware.createProductValidation,
  productController.createProduct
);

// Actualizar producto - permite hasta 4 imágenes
router.put(
  "/:id",
  uploadProductImages.array('fotos', 4), // Acepta hasta 4 imágenes con el campo 'fotos'
  productMiddleware.updateProductValidation,
  productController.updateProduct
);

router.delete(
  "/:id",
  productMiddleware.deleteProductValidation,
  productController.deleteProduct
);

router.patch(
  "/:id/estado",
  productMiddleware.changeProductStateValidation,
  productController.changeStateProduct
);

// Rutas adicionales para manejo de imágenes
router.post(
  "/upload-images",
  uploadProductImages.array('fotos', 4),
  imageUploadController.uploadImages
);

router.delete(
  "/delete-image",
  imageUploadController.deleteImageFromUrl
);

module.exports = router;