const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/payments_installments/payments_installmentsController');
const Validations = require('../../middlewares/payments_installments/payments_installmentsMiddlewares');
const { authMiddleware } = require('../../middlewares/auth/AuthMiddleware');

// ===================== Endpoints legacy (colección plana) =====================

// Crear pago/abono
router.post(
  '/',
  authMiddleware,
  Validations.createPagoAbonoValidation,
  Controller.createPagoAbono
);

// Listar todos
router.get('/', authMiddleware, Controller.getAllPagosAbonos);

// Buscar por término
router.get(
  '/buscar/:term',
  authMiddleware,
  Validations.searchPagosAbonosValidation,
  Controller.searchPagosAbonos
);

// Obtener por id
router.get(
  '/:id',
  authMiddleware,
  Validations.findPagoAbonoByIdValidation,
  Controller.getPagoAbonoById
);

// Anular
router.patch(
  '/:id/cancelar',
  authMiddleware,
  Validations.cancelPagoAbonoValidation,
  Controller.cancelPagoAbono
);

// ============ Endpoints anidados /projects/:projectId/payments ============
// Nota: monta este router bajo el prefijo /api/projects para que estas rutas queden activas.
// Ejemplo: app.use('/api/projects', paymentsInstallmentsRoutes);

router.post(
  '/:projectId/payments',
  authMiddleware,
  Validations.createProjectPaymentValidation,
  Controller.createProjectPayment
);

router.get(
  '/:projectId/payments',
  authMiddleware,
  Validations.listProjectPaymentsValidation,
  Controller.listProjectPayments
);

router.get(
  '/:projectId/payments/:paymentId',
  authMiddleware,
  Validations.getProjectPaymentValidation,
  Controller.getProjectPayment
);


router.delete(
  '/:projectId/payments/:paymentId',
  authMiddleware,
  Validations.deleteProjectPaymentValidation,
  Controller.deleteProjectPayment
);

module.exports = router;


