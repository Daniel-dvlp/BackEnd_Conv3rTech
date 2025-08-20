const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../../middlewares/validate');
const ctrl = require('../controllers/services.controller');

const r = Router();

r.get('/',
  query('categoryId').optional().isInt(),
  validate,
  ctrl.list
);

r.get('/:id',
  param('id').isInt(),
  validate,
  ctrl.find
);

r.post('/',
  body('url_imagen').isString().notEmpty(),
  body('nombre_servicio').isString().isLength({ min:1, max:50 }),
  body('id_categoria_servicio').isInt(),
  body('precio').isFloat({ min:0 }),
  body('duracion').isInt({ min:1 }),
  body('descripcion_servicio').optional().isString(),
  body('estado').optional().isIn(['activo','inactivo']),
  validate,
  ctrl.create
);

r.put('/:id',
  param('id').isInt(),
  body('url_imagen').isString().notEmpty(),
  body('nombre_servicio').isString().isLength({ min:1, max:50 }),
  body('id_categoria_servicio').isInt(),
  body('precio').isFloat({ min:0 }),
  body('duracion').isInt({ min:1 }),
  body('descripcion_servicio').optional().isString(),
  body('estado').isIn(['activo','inactivo']),
  validate,
  ctrl.update
);

r.patch('/:id/status',
  param('id').isInt(),
  body('estado').isIn(['activo','inactivo']),
  validate,
  ctrl.changeStatus
);

r.delete('/:id',
  param('id').isInt(),
  validate,
  ctrl.remove
);

module.exports = r;
