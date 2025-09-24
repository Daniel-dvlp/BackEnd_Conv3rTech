const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/payments_installments/payments_installmentsController');
const Validations = require('../../middlewares/payments_installments/payments_installmentsMiddlewares');
const { authMiddleware } = require('../../middlewares/auth/AuthMiddleware');

// Todas las rutas aquí son ANIDADAS bajo /api/projects

// Crear pago para un proyecto
router.post(
  '/:projectId/payments',
  authMiddleware,
  Validations.createProjectPaymentValidation,
  Controller.createProjectPayment
);

// Listar pagos del proyecto
router.get(
  '/:projectId/payments',
  authMiddleware,
  Validations.listProjectPaymentsValidation,
  Controller.listProjectPayments
);

// Obtener pago específico del proyecto
router.get(
  '/:projectId/payments/:paymentId',
  authMiddleware,
  Validations.getProjectPaymentValidation,
  Controller.getProjectPayment
);

// Anular (cancelar) un pago del proyecto
router.delete(
  '/:projectId/payments/:paymentId',
  authMiddleware,
  Validations.deleteProjectPaymentValidation,
  Controller.deleteProjectPayment
);

module.exports = router;


