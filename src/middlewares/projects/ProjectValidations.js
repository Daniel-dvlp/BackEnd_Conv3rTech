const { body, param, query } = require("express-validator");

// Validaciones para crear proyecto
const createProjectValidation = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio")
    .isLength({ max: 200 })
    .withMessage("El nombre no puede exceder los 200 caracteres"),

  body("numero_contrato")
    .optional()
    .isLength({ max: 50 })
    .withMessage("El número de contrato no puede exceder los 50 caracteres"),

  body("id_cliente")
    .notEmpty()
    .withMessage("El cliente es obligatorio")
    .isInt()
    .withMessage("El ID del cliente debe ser un número entero"),

  body("id_responsable")
    .notEmpty()
    .withMessage("El responsable es obligatorio")
    .isInt()
    .withMessage("El ID del responsable debe ser un número entero"),

  body("fecha_inicio")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .isISO8601()
    .withMessage("La fecha de inicio debe tener un formato válido"),

  body("fecha_fin")
    .notEmpty()
    .withMessage("La fecha de fin es obligatoria")
    .isISO8601()
    .withMessage("La fecha de fin debe tener un formato válido"),

  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["Pendiente", "En Progreso", "Completado", "Cancelado"])
    .withMessage(
      "El estado debe ser uno de: Pendiente, En Progreso, Completado, Cancelado"
    ),

  body("progreso")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("El progreso debe estar entre 0 y 100"),

  body("prioridad")
    .notEmpty()
    .withMessage("La prioridad es obligatoria")
    .isIn(["Baja", "Media", "Alta"])
    .withMessage("La prioridad debe ser una de: Baja, Media, Alta"),

  body("ubicacion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La ubicación no puede exceder los 500 caracteres"),

  body("descripcion")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder los 1000 caracteres"),

  body("observaciones")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Las observaciones no pueden exceder los 1000 caracteres"),

  body("costo_mano_obra")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El costo de mano de obra debe ser un número positivo"),

  // Validaciones para materiales
  body("materiales")
    .optional()
    .isArray()
    .withMessage("Los materiales deben ser un array"),

  body("materiales.*.id_producto")
    .if(body("materiales").exists())
    .notEmpty()
    .withMessage("El ID del producto es obligatorio para cada material")
    .isInt()
    .withMessage("El ID del producto debe ser un número entero"),

  body("materiales.*.cantidad")
    .if(body("materiales").exists())
    .notEmpty()
    .withMessage("La cantidad es obligatoria para cada material")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("materiales.*.precio_unitario")
    .if(body("materiales").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio unitario debe ser un número positivo"),

  // Validaciones para servicios
  body("servicios")
    .optional()
    .isArray()
    .withMessage("Los servicios deben ser un array"),

  body("servicios.*.id_servicio")
    .if(body("servicios").exists())
    .notEmpty()
    .withMessage("El ID del servicio es obligatorio para cada servicio")
    .isInt()
    .withMessage("El ID del servicio debe ser un número entero"),

  body("servicios.*.cantidad")
    .if(body("servicios").exists())
    .notEmpty()
    .withMessage("La cantidad es obligatoria para cada servicio")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("servicios.*.precio_unitario")
    .if(body("servicios").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio unitario debe ser un número positivo"),

  // Validaciones para empleados asociados
  body("empleadosAsociados")
    .optional()
    .isArray()
    .withMessage("Los empleados asociados deben ser un array"),

  body("empleadosAsociados.*.id_usuario")
    .if(body("empleadosAsociados").exists())
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio para cada empleado")
    .isInt()
    .withMessage("El ID del usuario debe ser un número entero"),

  // Validaciones para sedes
  body("sedes")
    .optional()
    .isArray()
    .withMessage("Las sedes deben ser un array"),

  body("sedes.*.nombre")
    .if(body("sedes").exists())
    .notEmpty()
    .withMessage("El nombre de la sede es obligatorio")
    .isLength({ max: 200 })
    .withMessage("El nombre de la sede no puede exceder los 200 caracteres"),

  body("sedes.*.ubicacion")
    .if(body("sedes").exists())
    .optional()
    .isLength({ max: 500 })
    .withMessage("La ubicación de la sede no puede exceder los 500 caracteres"),

  body("sedes.*.id_direccion")
    .if(body("sedes").exists())
    .optional()
    .isInt()
    .withMessage("El ID de la dirección debe ser un número entero"),

  body("sedes.*.presupuesto_materiales")
    .if(body("sedes").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El presupuesto de materiales debe ser un número positivo"),

  body("sedes.*.presupuesto_servicios")
    .if(body("sedes").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El presupuesto de servicios debe ser un número positivo"),

  body("sedes.*.presupuesto_total")
    .if(body("sedes").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El presupuesto total debe ser un número positivo"),

  body("sedes.*.presupuesto_restante")
    .if(body("sedes").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El presupuesto restante debe ser un número positivo"),

  // Validaciones para materiales de sede
  body("sedes.*.materialesAsignados")
    .if(body("sedes").exists())
    .optional()
    .isArray()
    .withMessage("Los materiales asignados deben ser un array"),

  body("sedes.*.materialesAsignados.*.id_producto")
    .if(body("sedes.*.materialesAsignados").exists())
    .notEmpty()
    .withMessage(
      "El ID del producto es obligatorio para cada material asignado"
    )
    .isInt()
    .withMessage("El ID del producto debe ser un número entero"),

  body("sedes.*.materialesAsignados.*.cantidad")
    .if(body("sedes.*.materialesAsignados").exists())
    .notEmpty()
    .withMessage("La cantidad es obligatoria para cada material asignado")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  // Validaciones para servicios de sede
  body("sedes.*.serviciosAsignados")
    .if(body("sedes").exists())
    .optional()
    .isArray()
    .withMessage("Los servicios asignados deben ser un array"),

  body("sedes.*.serviciosAsignados.*.id_servicio")
    .if(body("sedes.*.serviciosAsignados").exists())
    .notEmpty()
    .withMessage(
      "El ID del servicio es obligatorio para cada servicio asignado"
    )
    .isInt()
    .withMessage("El ID del servicio debe ser un número entero"),

  body("sedes.*.serviciosAsignados.*.cantidad")
    .if(body("sedes.*.serviciosAsignados").exists())
    .notEmpty()
    .withMessage("La cantidad es obligatoria para cada servicio asignado")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("sedes.*.serviciosAsignados.*.precio_unitario")
    .if(body("sedes.*.serviciosAsignados").exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio unitario debe ser un número positivo"),
];

// Validaciones para actualizar proyecto
const updateProjectValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),

  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre del proyecto no puede estar vacío")
    .isLength({ max: 200 })
    .withMessage("El nombre no puede exceder los 200 caracteres"),

  body("numero_contrato")
    .optional()
    .isLength({ max: 50 })
    .withMessage("El número de contrato no puede exceder los 50 caracteres"),

  body("id_cliente")
    .optional()
    .isInt()
    .withMessage("El ID del cliente debe ser un número entero"),

  body("id_responsable")
    .optional()
    .isInt()
    .withMessage("El ID del responsable debe ser un número entero"),

  body("fecha_inicio")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio debe tener un formato válido"),

  body("fecha_fin")
    .optional()
    .isISO8601()
    .withMessage("La fecha de fin debe tener un formato válido"),

  body("estado")
    .optional()
    .isIn(["Pendiente", "En Progreso", "Completado", "Cancelado"])
    .withMessage(
      "El estado debe ser uno de: Pendiente, En Progreso, Completado, Cancelado"
    ),

  body("progreso")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("El progreso debe estar entre 0 y 100"),

  body("prioridad")
    .optional()
    .isIn(["Baja", "Media", "Alta"])
    .withMessage("La prioridad debe ser una de: Baja, Media, Alta"),

  body("ubicacion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La ubicación no puede exceder los 500 caracteres"),

  body("descripcion")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder los 1000 caracteres"),

  body("observaciones")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Las observaciones no pueden exceder los 1000 caracteres"),

  body("costo_mano_obra")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El costo de mano de obra debe ser un número positivo"),
];

// Validaciones para eliminar proyecto
const deleteProjectValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),
];

// Validaciones para obtener proyecto por ID
const getProjectByIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),
];

// Validaciones para crear salida de material
const createSalidaMaterialValidation = [
  body("id_proyecto")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),

  body("id_proyecto_sede")
    .optional()
    .isInt()
    .withMessage("El ID de la sede debe ser un número entero"),

  body("id_producto")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio")
    .isInt()
    .withMessage("El ID del producto debe ser un número entero"),

  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("id_entregador")
    .notEmpty()
    .withMessage("El ID del entregador es obligatorio")
    .isInt()
    .withMessage("El ID del entregador debe ser un número entero"),

  body("receptor")
    .notEmpty()
    .withMessage("El receptor es obligatorio")
    .isLength({ max: 200 })
    .withMessage("El receptor no puede exceder los 200 caracteres"),

  body("observaciones")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden exceder los 500 caracteres"),

  body("costo_total")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El costo total debe ser un número positivo"),

  body("fecha_salida")
    .optional()
    .isISO8601()
    .withMessage("La fecha de salida debe tener un formato válido"),
];

// Validaciones para obtener salidas de material
const getSalidasMaterialValidation = [
  param("idProyecto")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),

  query("idSede")
    .optional()
    .isInt()
    .withMessage("El ID de la sede debe ser un número entero"),
];

// Validaciones para actualizar progreso
const updateProgressValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),

  body("progreso")
    .notEmpty()
    .withMessage("El progreso es obligatorio")
    .isInt({ min: 0, max: 100 })
    .withMessage("El progreso debe estar entre 0 y 100"),
];

// Validaciones para actualizar estado
const updateStatusValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isInt()
    .withMessage("El ID del proyecto debe ser un número entero"),

  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["Pendiente", "En Progreso", "Completado", "Cancelado"])
    .withMessage(
      "El estado debe ser uno de: Pendiente, En Progreso, Completado, Cancelado"
    ),
];

// Validaciones para filtros de búsqueda
const searchProjectsValidation = [
  query("search")
    .optional()
    .isLength({ max: 100 })
    .withMessage("El término de búsqueda no puede exceder los 100 caracteres"),

  query("estado")
    .optional()
    .isIn(["Pendiente", "En Progreso", "Completado", "Cancelado"])
    .withMessage(
      "El estado debe ser uno de: Pendiente, En Progreso, Completado, Cancelado"
    ),

  query("prioridad")
    .optional()
    .isIn(["Baja", "Media", "Alta"])
    .withMessage("La prioridad debe ser una de: Baja, Media, Alta"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor a 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entero entre 1 y 100"),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
  deleteProjectValidation,
  getProjectByIdValidation,
  createSalidaMaterialValidation,
  getSalidasMaterialValidation,
  updateProgressValidation,
  updateStatusValidation,
  searchProjectsValidation,
};
