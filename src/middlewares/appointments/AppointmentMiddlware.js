const { body, validationResult } = require("express-validator");

exports.validateAppointment = [
  body("id_cliente").isInt().withMessage("Cliente inválido"),
  body("id_usuario").isInt().withMessage("Trabajador inválido"),
  body("id_servicio").isInt().withMessage("Servicio inválido"),
  body("fecha").isDate().withMessage("Fecha inválida"),
  body("hora_inicio").notEmpty().withMessage("Hora de inicio requerida"),
  body("hora_fin").notEmpty().withMessage("Hora de fin requerida"),
  body("direccion").notEmpty().withMessage("Dirección requerida"),
  body("estado")
    .optional()
    .isIn(["Pendiente", "Confirmada", "Cancelada", "Completada"])
    .withMessage("Estado inválido"),

  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
