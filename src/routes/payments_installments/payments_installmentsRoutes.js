const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/payments_installments/payments_installmentsController');
const Validations = require('../../middlewares/payments_installments/payments_installmentsMiddlewares');
const { authMiddleware } = require('../../middlewares/auth/AuthMiddleware');

// Crear pago/abono
router.post(
  '/',
  authMiddleware,
  Validations.createPagoAbonoValidation,
  Controller.createPagoAbono
);

// Listar todos
router.get(
  '/',
  authMiddleware,
  Controller.getAllPagosAbonos
);

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

module.exports = router;


