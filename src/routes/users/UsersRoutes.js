const express = require("express");
const router = express.Router();
const UsersControllers = require("../../controllers/users/UsersControllers");
const UsuariosValidations = require("../../middlewares/users/UsuariosValidations");
const {
  authMiddleware,
  permissionMiddleware,
} = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas para el perfil del usuario logueado (solo requieren autenticación)
// Deben ir ANTES de las rutas con parámetros como /:id para evitar conflictos
router.get("/profile/me", UsersControllers.getMyProfile);
router.put(
  "/profile/me",
  UsuariosValidations.updateMyProfileValidation,
  UsersControllers.updateMyProfile
);
router.put(
  "/profile/change-password",
  UsuariosValidations.changeMyPasswordValidation,
  UsersControllers.changeMyPassword
);

// Rutas para usuarios (requieren autenticación y permisos)
router.post(
  "/",
  permissionMiddleware("Usuarios", "Crear"),
  UsuariosValidations.createUserValidation,
  UsersControllers.createUser
);
router.get(
  "/",
  permissionMiddleware("Usuarios", "Ver"),
  UsersControllers.getAllUsers
);
router.get(
  "/role/:roleName",
  permissionMiddleware("Usuarios", "Ver"),
  UsersControllers.getUsersByRole
);
router.get(
  "/:id",
  permissionMiddleware("Usuarios", "Ver"),
  UsuariosValidations.findUserByIdValidation,
  UsersControllers.getUserById
);
router.put(
  "/:id",
  permissionMiddleware("Usuarios", "Editar"),
  UsuariosValidations.updateUserValidation,
  UsersControllers.updateUser
);
router.delete(
  "/:id",
  permissionMiddleware("Usuarios", "Eliminar"),
  UsuariosValidations.deleteUserValidation,
  UsersControllers.deleteUser
);

router.patch(
  "/:id/status",
  permissionMiddleware("Usuarios", "Editar"),
  // Se puede agregar validación específica si es necesario
  UsersControllers.changeUserStatus
);

module.exports = router;
