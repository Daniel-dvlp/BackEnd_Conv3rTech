const { body, param } = require("express-validator");

// Validaciones para login
const loginValidation = [
  body("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("El correo debe tener un formato válido"),
  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

// Validaciones para actualizar perfil
const updateProfileValidation = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El nombre no puede exceder los 50 caracteres"),
  body("apellido")
    .optional()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El apellido no puede exceder los 50 caracteres"),
  body("celular")
    .optional()
    .notEmpty()
    .withMessage("El celular no puede estar vacío")
    .isLength({ min: 7, max: 15 })
    .withMessage("El celular debe tener entre 7 y 15 caracteres"),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("El correo no puede estar vacío")
    .isEmail()
    .withMessage("El correo debe tener un formato válido"),
  body("documento")
    .optional()
    .notEmpty()
    .withMessage("El documento no puede estar vacío")
    .isLength({ max: 15 })
    .withMessage("El documento no puede exceder los 15 caracteres"),
  body("tipoDocumento")
    .optional()
    .isIn(["CC", "CE", "PPT", "NIT", "PA"])
    .withMessage("El tipo de documento debe ser válido"),
];

// Validaciones para cambiar contraseña
const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es obligatoria"),
  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

// Validaciones para crear rol
const createRoleValidation = [
  body("nombre_rol")
    .notEmpty()
    .withMessage("El nombre del rol es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El nombre del rol no puede exceder los 50 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder los 500 caracteres"),
];

// Validaciones para actualizar rol
const updateRoleValidation = [
  body("nombre_rol")
    .optional()
    .notEmpty()
    .withMessage("El nombre del rol no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El nombre del rol no puede exceder los 50 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder los 500 caracteres"),
];

// Validaciones para crear permiso
const createPermissionValidation = [
  body("nombre_permiso")
    .notEmpty()
    .withMessage("El nombre del permiso es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre del permiso no puede exceder los 100 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder los 500 caracteres"),
];

// Validaciones para crear privilegio
const createPrivilegeValidation = [
  body("nombre_privilegio")
    .notEmpty()
    .withMessage("El nombre del privilegio es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El nombre del privilegio no puede exceder los 50 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder los 500 caracteres"),
];

// Validaciones para actualizar permiso
const updatePermissionValidation = [
  body("nombre_permiso")
    .optional()
    .notEmpty()
    .withMessage("El nombre del permiso no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("El nombre del permiso no puede exceder los 100 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder los 500 caracteres"),
];

// Validaciones para actualizar privilegio
const updatePrivilegeValidation = [
  body("nombre_privilegio")
    .optional()
    .notEmpty()
    .withMessage("El nombre del privilegio no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El nombre del privilegio no puede exceder los 50 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder los 500 caracteres"),
];

// Validaciones para ID de permiso
const permissionIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del permiso es obligatorio")
    .isInt()
    .withMessage("El ID del permiso debe ser un número entero"),
];

// Validaciones para ID de privilegio
const privilegeIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID del privilegio es obligatorio")
    .isInt()
    .withMessage("El ID del privilegio debe ser un número entero"),
];

// Validaciones para parámetros de ID
const idValidation = [
  param("id")
    .notEmpty()
    .withMessage("El ID es obligatorio")
    .isInt()
    .withMessage("El ID debe ser un número entero"),
];

// Validaciones para asignar permisos a rol
const assignPermissionsValidation = [
  body("permisos")
    .isArray()
    .withMessage("Los permisos deben ser un array")
    .notEmpty()
    .withMessage("Debe especificar al menos un permiso"),
  body("permisos.*.id_permiso")
    .isInt()
    .withMessage("El ID del permiso debe ser un número entero"),
  body("permisos.*.privilegios")
    .isArray()
    .withMessage("Los privilegios deben ser un array")
    .notEmpty()
    .withMessage("Debe especificar al menos un privilegio"),
  body("permisos.*.privilegios.*.id_privilegio")
    .isInt()
    .withMessage("El ID del privilegio debe ser un número entero"),
];

module.exports = {
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  createRoleValidation,
  updateRoleValidation,
  createPermissionValidation,
  updatePermissionValidation,
  createPrivilegeValidation,
  updatePrivilegeValidation,
  idValidation,
  permissionIdValidation,
  privilegeIdValidation,
  assignPermissionsValidation,
};
