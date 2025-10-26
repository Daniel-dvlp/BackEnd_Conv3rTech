const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/payments_installments/payments_installmentsController");
const Validations = require("../../middlewares/payments_installments/payments_installmentsMiddlewares");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
//router.use(authMiddleware);

// ===================== Endpoints legacy (colección plana) =====================

// Crear pago/abono
router.post(
  "/",
  Validations.createPagoAbonoValidation,
  Controller.createPagoAbono
);

// Listar todos
router.get("/", Controller.getAllPagosAbonos);

// Buscar por término
router.get(
  "/buscar/:term",
  Validations.searchPagosAbonosValidation,
  Controller.searchPagosAbonos
);

// Obtener por id
router.get(
  "/:id",
  Validations.findPagoAbonoByIdValidation,
  Controller.getPagoAbonoById
);

// Anular
router.patch(
  "/:id/cancelar",
  Validations.cancelPagoAbonoValidation,
  Controller.cancelPagoAbono
);

// ============ Endpoints anidados /projects/:projectId/payments ============
// Nota: monta este router bajo el prefijo /api/projects para que estas rutas queden activas.
// Ejemplo: app.use('/api/projects', paymentsInstallmentsRoutes);

router.post(
  "/:projectId/payments",
  Validations.createProjectPaymentValidation,
  Controller.createProjectPayment
);

router.get(
  "/:projectId/payments",
  Validations.listProjectPaymentsValidation,
  Controller.listProjectPayments
);

router.get(
  "/:projectId/payments/:paymentId",
  Validations.getProjectPaymentValidation,
  Controller.getProjectPayment
);

router.delete(
  "/:projectId/payments/:paymentId",
  Validations.deleteProjectPaymentValidation,
  Controller.deleteProjectPayment
);

module.exports = router;
