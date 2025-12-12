const express = require("express");
const router = express.Router();

const serviceCategoryController = require("../../controllers/service_categories/ServiceCategoryController");
const {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
} = require("../../middlewares/service_categories/ServiceCategoryValidation");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// LISTAR TODAS
router.get("/", permissionMiddleware("Categoría de servicios", "Ver"), serviceCategoryController.getAllCategories);

// LISTAR POR ID
router.get(
  "/:id",
  permissionMiddleware("Categoría de servicios", "Ver"),
  categoryIdValidation,
  serviceCategoryController.getCategoryById
);

// CREAR
router.post(
  "/",
  permissionMiddleware("Categoría de servicios", "Crear"),
  createCategoryValidation,
  serviceCategoryController.createCategory
);

// ACTUALIZAR
router.put(
  "/:id",
  permissionMiddleware("Categoría de servicios", "Editar"),
  updateCategoryValidation,
  serviceCategoryController.updateCategory
);

// ELIMINAR
router.delete(
  "/:id",
  permissionMiddleware("Categoría de servicios", "Eliminar"),
  categoryIdValidation,
  serviceCategoryController.deleteCategory
);

// CAMBIAR ESTADO
router.patch(
  "/:id/state",
  permissionMiddleware("Categoría de servicios", "Editar"),
  categoryIdValidation,
  serviceCategoryController.changeStateCategory
);

module.exports = router;
