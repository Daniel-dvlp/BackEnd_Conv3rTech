const { body, param } = require("express-validator");
const Usuario = require("../../models/users/Users");

// Validaciones para verificar la existencia de un usuario
const validateUsuariosExistence = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }
};

// Validaciones para verificar la unicidad del documento y correo
const validateUsuariosUniqueDocumento = async (documento) => {
  if (!documento) return true; // Si no hay documento, no validar
  const usuario = await Usuario.findOne({ where: { documento } });
  if (usuario) {
    throw new Error("El documento ya está en uso");
  }
};

const validateUsuariosUniqueCorreo = async (correo) => {
  if (!correo) return true; // Si no hay correo, no validar
  const usuario = await Usuario.findOne({ where: { correo } });
  if (usuario) {
    throw new Error("El correo ya está en uso");
  }
};

// Validaciones base para los usuarios
const validateBaseUsuarios = [
  body("documento")
    .notEmpty()
    .withMessage("El documento es obligatorio")
    .isLength({ max: 15 })
    .withMessage("El documento no puede exceder los 15 caracteres"),
  body("tipo_documento")
    .notEmpty()
    .withMessage("El tipo de documento es obligatorio")
    .isIn(["CC", "CE", "PPT", "NIT", "PA"])
    .withMessage("Tipo de documento inválido"),
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El nombre no puede exceder los 50 caracteres"),
  body("apellido")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El apellido no puede exceder los 50 caracteres"),
  body("celular")
    .notEmpty()
    .withMessage("El celular es obligatorio")
    .isLength({ min: 7, max: 15 })
    .withMessage("El celular debe tener entre 7 y 15 caracteres"),
  body("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Correo electrónico inválido")
    .isLength({ max: 100 })
    .withMessage("El correo no puede exceder los 100 caracteres"),
  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("id_rol")
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .isInt()
    .withMessage("El rol debe ser un número entero"),
  body("estado_usuario")
    .notEmpty()
    .withMessage("El estado del usuario es obligatorio")
    .isIn([
      "Activo",
      "Inactivo",
      "Suspendido",
      "En vacaciones",
      "Retirado",
      "Licencia médica",
    ])
    .withMessage("Estado de usuario inválido"),
];

// Validaciones para crear
const createUserValidation = [
  ...validateBaseUsuarios,
  body("documento").custom(validateUsuariosUniqueDocumento),
  body("correo").custom(validateUsuariosUniqueCorreo),
];

// Validaciones para verificar la unicidad del documento y correo al actualizar
const validateUsuariosUniqueDocumentoUpdate = async (documento, { req }) => {
  if (!documento) return true; // Si no hay documento, no validar
  const usuario = await Usuario.findOne({ where: { documento } });
  if (usuario && usuario.id_usuario != req.params.id) {
    throw new Error("El documento ya está en uso");
  }
};

const validateUsuariosUniqueCorreoUpdate = async (correo, { req }) => {
  if (!correo) return true; // Si no hay correo, no validar
  const usuario = await Usuario.findOne({ where: { correo } });
  if (usuario && usuario.id_usuario != req.params.id) {
    throw new Error("El correo ya está en uso");
  }
};

// Validaciones para actualizar
const updateUserValidation = [
  body("documento")
    .optional()
    .isString()
    .custom(validateUsuariosUniqueDocumentoUpdate),
  body("tipo_documento").optional().isIn(["CC", "CE", "PPT", "NIT", "PA"]),
  body("nombre").optional().isString(),
  body("apellido").optional().isString(),
  body("celular").optional().isString(),
  body("correo")
    .optional()
    .isEmail()
    .custom(validateUsuariosUniqueCorreoUpdate),
  body("contrasena").optional().isString(),
  body("estado_usuario")
    .optional()
    .isIn([
      "Activo",
      "Inactivo",
      "Suspendido",
      "En vacaciones",
      "Retirado",
      "Licencia médica",
    ])
    .withMessage("Estado de usuario inválido"),
];

// Validaciones para eliminar
const deleteUserValidation = [
  param("id").isInt().withMessage("El ID del usuario debe ser obligatorio"),
  param("id").custom(validateUsuariosExistence),
];

// Validaciones para buscar por Id
const findUserByIdValidation = [
  param("id").isInt().withMessage("El ID del usuario debe ser obligatorio"),
  param("id").custom(validateUsuariosExistence),
];

// Validaciones para actualizar mi perfil (usuario logueado)
const validateMyProfileUniqueDocumento = async (documento, { req }) => {
  if (!documento) return true; // Si no se proporciona documento, no validar
  const usuario = await Usuario.findOne({ where: { documento } });
  if (usuario && usuario.id_usuario != req.user.id) {
    throw new Error("El documento ya está en uso");
  }
};

const validateMyProfileUniqueCorreo = async (correo, { req }) => {
  if (!correo) return true; // Si no se proporciona correo, no validar
  const usuario = await Usuario.findOne({ where: { correo } });
  if (usuario && usuario.id_usuario != req.user.id) {
    throw new Error("El correo ya está en uso");
  }
};

const updateMyProfileValidation = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El nombre no puede exceder los 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .-]+$/)
    .withMessage("El nombre contiene caracteres inválidos"),
  body("apellido")
    .optional()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El apellido no puede exceder los 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .-]+$/)
    .withMessage("El apellido contiene caracteres inválidos"),
  body("correo")
    .optional()
    .notEmpty()
    .withMessage("El correo no puede estar vacío")
    .isEmail()
    .withMessage("Correo electrónico inválido")
    .isLength({ max: 100 })
    .withMessage("El correo no puede exceder los 100 caracteres")
    .custom(validateMyProfileUniqueCorreo),
  body("celular")
    .optional()
    .notEmpty()
    .withMessage("El celular no puede estar vacío")
    .isLength({ min: 7, max: 15 })
    .withMessage("El celular debe tener entre 7 y 15 caracteres")
    .matches(/^\+?\d{7,15}$/)
    .withMessage("El celular contiene caracteres inválidos"),
  body("documento")
    .optional()
    .notEmpty()
    .withMessage("El documento no puede estar vacío")
    .isLength({ max: 15 })
    .withMessage("El documento no puede exceder los 15 caracteres")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("El documento contiene caracteres inválidos")
    .custom(validateMyProfileUniqueDocumento),
  body("tipo_documento")
    .optional()
    .isIn(["CC", "CE", "TI", "PP"])
    .withMessage("Tipo de documento inválido"),
];

// Validaciones para cambiar contraseña
const changeMyPasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es obligatoria")
    .isString()
    .withMessage("La contraseña actual debe ser una cadena de texto"),
  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres")
    .isString()
    .withMessage("La nueva contraseña debe ser una cadena de texto"),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
  findUserByIdValidation,
  updateMyProfileValidation,
  changeMyPasswordValidation,
};
