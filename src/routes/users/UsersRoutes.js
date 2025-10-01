const express = require("express");
const router = express.Router();
const UsersControllers = require("../../controllers/users/UsersControllers");
const UsuariosValidations = require("../../middlewares/users/UsuariosValidations");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas para usuarios (requieren autenticación y permisos)
router.post(
  "/",
  UsuariosValidations.createUserValidation,
  UsersControllers.createUser
);
router.get("/", UsersControllers.getAllUsers);
router.get(
  "/:id",
  UsuariosValidations.findUserByIdValidation,
  UsersControllers.getUserById
);
router.put(
  "/:id",
  UsuariosValidations.updateUserValidation,
  UsersControllers.updateUser
);
router.delete(
  "/:id",
  UsuariosValidations.deleteUserValidation,
  UsersControllers.deleteUser
);

// Rutas para el perfil del usuario logueado (solo requieren autenticación)
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

module.exports = router;
