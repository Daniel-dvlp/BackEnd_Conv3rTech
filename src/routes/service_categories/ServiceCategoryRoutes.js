const express = require("express");
const router = express.Router();

const serviceCategoryController = require("../../controllers/service_categories/ServiceCategoryController");
const {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
} = require("../../middlewares/service_categories/ServiceCategoryValidation");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// LISTAR TODAS
router.get("/", serviceCategoryController.getAllCategories);

// LISTAR POR ID
router.get(
  "/:id",
  categoryIdValidation,
  serviceCategoryController.getCategoryById
);

// CREAR
router.post(
  "/",
  createCategoryValidation,
  serviceCategoryController.createCategory
);

// ACTUALIZAR
router.put(
  "/:id",
  updateCategoryValidation,
  serviceCategoryController.updateCategory
);

// ELIMINAR
router.delete(
  "/:id",
  categoryIdValidation,
  serviceCategoryController.deleteCategory
);

module.exports = router;
