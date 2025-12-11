const express = require("express");
const router = express.Router();

const categoryController = require("../../controllers/products_category/ProductsCategoryController.js");
const categoryValidations = require("../../middlewares/products_category/ProductsCategoryMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", permissionMiddleware("Categoría de productos", "Ver"), categoryController.getAllCategories);
router.get(
  "/:id",
  permissionMiddleware("Categoría de productos", "Ver"),
  categoryValidations.getCategoryByIdValidation,
  categoryController.getCategoryById
);
router.post(
  "/",
  permissionMiddleware("Categoría de productos", "Crear"),
  categoryValidations.createCategoryValidation,
  categoryController.createCategory
);
router.put(
  "/:id",
  permissionMiddleware("Categoría de productos", "Editar"),
  categoryValidations.updateCategoryValidation,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  permissionMiddleware("Categoría de productos", "Eliminar"),
  categoryValidations.deleteCategoryValidation,
  categoryController.deleteCategory
);
router.patch(
  "/:id",
  permissionMiddleware("Categoría de productos", "Editar"),
  categoryValidations.changeStateValidation,
  categoryController.changeStateCategory
);

module.exports = router;
