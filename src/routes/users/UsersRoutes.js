const express = require('express');
const router = express.Router();
const UsersControllers = require('../../controllers/users/UsersControllers');
const UsuariosValidations = require('../../middlewares/users/UsuariosValidations');

// Rutas para usuarios
router.post('/', UsuariosValidations.createUserValidation, UsersControllers.createUser);
router.get('/', UsersControllers.getAllUsers);
router.get('/:id', UsuariosValidations.findUserByIdValidation, UsersControllers.getUserById);
router.put('/:id', UsuariosValidations.updateUserValidation, UsersControllers.updateUser);
router.delete('/:id', UsuariosValidations.deleteUserValidation, UsersControllers.deleteUser);


module.exports = router;