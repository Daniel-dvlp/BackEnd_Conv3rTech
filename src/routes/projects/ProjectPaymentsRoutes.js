const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/payments_installments/payments_installmentsController");
const Validations = require("../../middlewares/payments_installments/payments_installmentsMiddlewares");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Todas las rutas aquí son ANIDADAS bajo /api/projects

// Crear pago para un proyecto
router.post(
  "/:projectId/payments",
  permissionMiddleware("Pagos y abonos", "Crear"),
  Validations.createProjectPaymentValidation,
  Controller.createProjectPayment
);

// Listar pagos del proyecto
router.get(
  "/:projectId/payments",
  permissionMiddleware("Pagos y abonos", "Ver"),
  Validations.listProjectPaymentsValidation,
  Controller.listProjectPayments
);

// Obtener pago específico del proyecto
router.get(
  "/:projectId/payments/:paymentId",
  permissionMiddleware("Pagos y abonos", "Ver"),
  Validations.getProjectPaymentValidation,
  Controller.getProjectPayment
);

// Anular (cancelar) un pago del proyecto
router.delete(
  "/:projectId/payments/:paymentId",
  permissionMiddleware("Pagos y abonos", "Eliminar"),
  Validations.deleteProjectPaymentValidation,
  Controller.deleteProjectPayment
);

module.exports = router;
