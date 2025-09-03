const { Router } = require('express');
const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate');
const ctrl = require('../controllers/appointments.controller');

const r = Router();

r.get('/', ctrl.list);
r.get('/:id', param('id').isInt(), validate, ctrl.find);

r.post('/',
  body('id_cliente').isInt(),
  body('id_direccion').isInt(),
  body('fecha_hora').isISO8601().toDate(),
  body('id_programacion_laboral').isInt(),
  body('id_usuario').isInt(),
  body('estado').optional().isIn(['Programada','Completada','Cancelada','Reprogramada']),
  validate,
  ctrl.create
);

r.put('/:id',
  param('id').isInt(),
  body('id_cliente').isInt(),
  body('id_direccion').isInt(),
  body('fecha_hora').isISO8601().toDate(),
  body('id_programacion_laboral').isInt(),
  body('id_usuario').isInt(),
  body('estado').isIn(['Programada','Completada','Cancelada','Reprogramada']),
  validate,
  ctrl.update
);

r.patch('/:id/status',
  param('id').isInt(),
  body('estado').isIn(['Programada','Completada','Cancelada','Reprogramada']),
  validate,
  ctrl.changeStatus
);

r.delete('/:id', param('id').isInt(), validate, ctrl.remove);

module.exports = r;
