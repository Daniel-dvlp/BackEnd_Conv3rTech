const express = require('express');
const router = express.Router();
const AddressClientsControllers = require('../../controllers/clients/AddressClientsControllers');
const AddressClientsMiddlewares = require('../../middlewares/clients/AddressClientsMiddlewares');

// Rutas para direcciones de clientes
router.post('/', AddressClientsMiddlewares.validateCreateAddressClients, AddressClientsControllers.createAddressClient);
router.get('/', AddressClientsControllers.getAllAddressClients);
router.put('/:id', AddressClientsMiddlewares.validateUpdateAddressClients, AddressClientsControllers.updateAddressClient);
router.delete('/:id', AddressClientsMiddlewares.validateDeleteAddressClients, AddressClientsControllers.deleteAddressClient);

module.exports = router;