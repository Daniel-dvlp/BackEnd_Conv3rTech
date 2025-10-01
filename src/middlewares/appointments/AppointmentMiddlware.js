const { body } = require("express-validator");

exports.validateAppointment = [
  body("id_cliente").isInt().withMessage("Cliente inválido"),
  body("id_usuario").isInt().withMessage("Trabajador inválido"),
  body("id_servicio").isInt().withMessage("Servicio inválido"),
  body("fecha").isDate().withMessage("Fecha inválida"),
  body("hora_inicio").notEmpty().withMessage("Hora de inicio requerida"),
  body("hora_fin").notEmpty().withMessage("Hora de fin requerida"),
];
