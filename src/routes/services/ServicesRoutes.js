const express = require('express');
const router = express.Router();

const serviceController = require('../../controllers/services/ServiceController'); // <-- RUTA CORREGIDA
const {
    createServiceValidation,
    updateServiceValidation,
    serviceIdValidation
} = require('../../middlewares/services/ServicesMiddleware');

// LISTAR TODOS
router.get('/', serviceController.getAllServices);

// LISTAR POR ID
router.get('/:id', serviceIdValidation, serviceController.getServiceById);

// CREAR
router.post('/', createServiceValidation, serviceController.createService);

// ACTUALIZAR
router.put('/:id', updateServiceValidation, serviceController.updateService);

// ELIMINAR
router.delete('/:id', serviceIdValidation, serviceController.deleteService);

module.exports = router;
