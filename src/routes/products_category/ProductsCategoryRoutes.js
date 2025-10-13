const express = require("express");
const router = express.Router();

const categoryController = require("../../controllers/products_category/ProductsCategoryController.js");
const categoryValidations = require("../../middlewares/products_category/ProductsCategoryMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", categoryController.getAllCategories);
router.get(
  "/:id",
  categoryValidations.getCategoryByIdValidation,
  categoryController.getCategoryById
);
router.post(
  "/",
  categoryValidations.createCategoryValidation,
  categoryController.createCategory
);
router.put(
  "/:id",
  categoryValidations.updateCategoryValidation,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  categoryValidations.deleteCategoryValidation,
  categoryController.deleteCategory
);
router.patch(
  "/:id",
  categoryValidations.changeStateValidation,
  categoryController.changeStateCategory
);

module.exports = router;
