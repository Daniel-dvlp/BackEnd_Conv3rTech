const express = require("express");
const router = express.Router();
const datasheetController = require("../../controllers/products/DatasheetController");
const datasheetMiddleware = require("../../middlewares/products/DatasheetMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

router.get("/", permissionMiddleware("Productos", "Ver"), datasheetController.getAllDatasheets);
router.get(
  "/:id",
  permissionMiddleware("Productos", "Ver"),
  datasheetMiddleware.getDataSheetByIdValidation,
  datasheetController.getDatasheetById
);
router.post(
  "/",
  permissionMiddleware("Productos", "Crear"),
  datasheetMiddleware.createDataSheetValidation,
  datasheetController.createDatasheet
);
router.put(
  "/:id",
  permissionMiddleware("Productos", "Editar"),
  datasheetMiddleware.updateDataSheetValidation,
  datasheetController.updateDatasheet
);
router.delete(
  "/:id",
  permissionMiddleware("Productos", "Eliminar"),
  datasheetMiddleware.deleteDataSheetValidation,
  datasheetController.deleteDatasheet
);

module.exports = router;
