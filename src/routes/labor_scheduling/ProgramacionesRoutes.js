const express = require('express');
const ProgramacionesController = require('../../controllers/labor_scheduling/ProgramacionesController');

const router = express.Router();

router.get('/', ProgramacionesController.list);
router.get('/usuarios-disponibles', ProgramacionesController.listUsuariosDisponibles);
router.get('/:programacionId', ProgramacionesController.detail);
router.post('/', ProgramacionesController.create);
router.put('/:programacionId', ProgramacionesController.update);
router.delete('/:programacionId', ProgramacionesController.remove);

module.exports = router;

