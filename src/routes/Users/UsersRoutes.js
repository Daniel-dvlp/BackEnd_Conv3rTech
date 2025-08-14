const express = require('express');
const router = express.Router();
const UsersControllers = require('../../controllers/Users/UsersControllers');
const UsuariosValidations = require('../../middlewares/Users/UsuariosValidations');

// Rutas para usuarios
router.post('/', UsuariosValidations.createUserValidation, UsersControllers.createUser);
router.get('/', UsersControllers.getAllUsers);
router.get('/:id', UsuariosValidations.findUserByIdValidation, UsersControllers.getUserById);
router.put('/:id', UsuariosValidations.updateUserValidation, UsersControllers.updateUser);

module.exports = router;