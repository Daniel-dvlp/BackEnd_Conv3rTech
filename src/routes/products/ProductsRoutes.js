const express = require("express");
const router = express.Router();
const productController = require("../../controllers/products/ProductController");
const imageUploadController = require("../../controllers/products/ImageUploadController");
const productMiddleware = require("../../middlewares/products/ProductMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");
const { uploadProductImages } = require("../../config/cloudinary");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas específicas de imágenes DEBEN ir antes de las rutas genéricas
router.post(
  "/upload-images",
  permissionMiddleware("Productos", "Crear"),
  uploadProductImages.array('fotos', 4),
  imageUploadController.uploadImages
);

router.delete(
  "/delete-image",
  permissionMiddleware("Productos", "Eliminar"),
  imageUploadController.deleteImageFromUrl
);

// Rutas genéricas
router.get("/", permissionMiddleware("Productos", "Ver"), productController.getAllProducts);

router.get(
  "/:id",
  permissionMiddleware("Productos", "Ver"),
  productMiddleware.getProductByIdValidation,
  productController.getProductById
);

// Crear producto - permite hasta 4 imágenes
router.post(
  "/",
  permissionMiddleware("Productos", "Crear"),
  uploadProductImages.array('fotos', 4), // Acepta hasta 4 imágenes con el campo 'fotos'
  productMiddleware.createProductValidation,
  productController.createProduct
);

// Actualizar producto - permite hasta 4 imágenes
router.put(
  "/:id",
  permissionMiddleware("Productos", "Editar"),
  uploadProductImages.array('fotos', 4), // Acepta hasta 4 imágenes con el campo 'fotos'
  productMiddleware.updateProductValidation,
  productController.updateProduct
);

router.delete(
  "/:id",
  permissionMiddleware("Productos", "Eliminar"),
  productMiddleware.deleteProductValidation,
  productController.deleteProduct
);

router.patch(
  "/:id/estado",
  permissionMiddleware("Productos", "Editar"),
  productMiddleware.changeProductStateValidation,
  productController.changeStateProduct
);

module.exports = router;