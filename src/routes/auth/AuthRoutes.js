const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth/AuthController");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");
const {
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  requestPasswordRecoveryValidation,
  resetPasswordWithCodeValidation,
} = require("../../middlewares/auth/AuthValidations");

// Rutas públicas
router.post("/login", loginValidation, AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post(
  "/password/recovery/request",
  requestPasswordRecoveryValidation,
  AuthController.requestPasswordRecovery
);
router.post(
  "/password/recovery/reset",
  resetPasswordWithCodeValidation,
  AuthController.resetPasswordWithCode
);

// Rutas protegidas
router.use(authMiddleware);

router.post("/logout", AuthController.logout);
router.get("/profile", AuthController.getProfile);
router.put("/profile", updateProfileValidation, AuthController.updateProfile);
router.put(
  "/change-password",
  changePasswordValidation,
  AuthController.changePassword
);
router.get("/permissions", AuthController.getMyPermissions);

module.exports = router;
