const express = require("express");
const router = express.Router();
const supplierController = require("../../controllers/supplier/SupplierController");
const supplierValidations = require("../../middlewares/supplier/SupplierValidations");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.post(
  "/",
  /* permissionMiddleware("Proveedores", "Crear"), */
  //supplierValidations.createSupplierValidation,
  supplierController.createSupplier
);
router.get("/", /* permissionMiddleware("Proveedores", "Ver"), */ supplierController.getAllSuppliers);
router.get(
  "/:id",
  /* permissionMiddleware("Proveedores", "Ver"), */
  supplierValidations.findSupplierByIdValidation,
  supplierController.getSupplierById
);
router.put(
  "/:id",
  permissionMiddleware("Proveedores", "Editar"),
  supplierValidations.updateSupplierValidation,
  supplierController.updateSupplier
);
router.delete(
  "/:id",
  permissionMiddleware("Proveedores", "Eliminar"),
  supplierValidations.deleteSupplierValidation,
  supplierController.deleteSupplier
);
router.patch(
  "/:id/state",
  permissionMiddleware("Proveedores", "Editar"),
  supplierValidations.changeStateSupplierValidation,
  supplierController.changeStateSupplier
);

module.exports = router;
