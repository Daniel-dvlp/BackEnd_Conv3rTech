const express = require("express");
const router = express.Router();
const UsersControllers = require("../../controllers/users/UsersControllers");
const UsuariosValidations = require("../../middlewares/users/UsuariosValidations");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Rutas para usuarios (requieren autenticación y permisos)
router.post(
  "/",
  authMiddleware,
  UsuariosValidations.createUserValidation,
  UsersControllers.createUser
);
router.get("/", authMiddleware, UsersControllers.getAllUsers);
router.get(
  "/:id",
  authMiddleware,
  UsuariosValidations.findUserByIdValidation,
  UsersControllers.getUserById
);
router.put(
  "/:id",
  authMiddleware,
  UsuariosValidations.updateUserValidation,
  UsersControllers.updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  UsuariosValidations.deleteUserValidation,
  UsersControllers.deleteUser
);

// Rutas para el perfil del usuario logueado (solo requieren autenticación)
router.get("/profile/me", authMiddleware, UsersControllers.getMyProfile);
router.put(
  "/profile/me",
  authMiddleware,
  UsuariosValidations.updateMyProfileValidation,
  UsersControllers.updateMyProfile
);
router.put(
  "/profile/change-password",
  authMiddleware,
  UsuariosValidations.changeMyPasswordValidation,
  UsersControllers.changeMyPassword
);

module.exports = router;
