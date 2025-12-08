const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/payments_installments/payments_installmentsController");
const Validations = require("../../middlewares/payments_installments/payments_installmentsMiddlewares");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// ===================== Endpoints legacy (colección plana) =====================

// Crear pago/abono
router.post(
  "/",
  permissionMiddleware("Pagos y abonos", "Crear"),
  Validations.createPagoAbonoValidation,
  Controller.createPagoAbono
);

// Listar todos
router.get("/", permissionMiddleware("Pagos y abonos", "Ver"), Controller.getAllPagosAbonos);

// Buscar por término
router.get(
  "/buscar/:term",
  permissionMiddleware("Pagos y abonos", "Ver"),
  Validations.searchPagosAbonosValidation,
  Controller.searchPagosAbonos
);

// Obtener por id
router.get(
  "/:id",
  permissionMiddleware("Pagos y abonos", "Ver"),
  Validations.findPagoAbonoByIdValidation,
  Controller.getPagoAbonoById
);

// Anular
router.patch(
  "/:id/cancelar",
  permissionMiddleware("Pagos y abonos", "Eliminar"),
  Validations.cancelPagoAbonoValidation,
  Controller.cancelPagoAbono
);

// ============ Endpoints anidados /projects/:projectId/payments ============
// Nota: monta este router bajo el prefijo /api/projects para que estas rutas queden activas.
// Ejemplo: app.use('/api/projects', paymentsInstallmentsRoutes);

router.post(
  "/:projectId/payments",
  permissionMiddleware("Pagos y abonos", "Crear"),
  Validations.createProjectPaymentValidation,
  Controller.createProjectPayment
);

router.get(
  "/:projectId/payments",
  permissionMiddleware("Pagos y abonos", "Ver"),
  Validations.listProjectPaymentsValidation,
  Controller.listProjectPayments
);

router.get(
  "/:projectId/payments/:paymentId",
  permissionMiddleware("Pagos y abonos", "Ver"),
  Validations.getProjectPaymentValidation,
  Controller.getProjectPayment
);

router.delete(
  "/:projectId/payments/:paymentId",
  permissionMiddleware("Pagos y abonos", "Eliminar"),
  Validations.deleteProjectPaymentValidation,
  Controller.deleteProjectPayment
);

module.exports = router;
