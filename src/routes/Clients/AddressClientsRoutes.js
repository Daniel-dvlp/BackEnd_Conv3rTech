const express = require('express');
const router = express.Router();
const AddressClientsControllers = require('../../controllers/Clients/AddressClientsControllers');
const AddressClientsMiddlewares = require('../../middlewares/Clients/AddressClientsMiddlewares');

// Rutas para direcciones de clientes
router.post('/', AddressClientsMiddlewares.validateCreateAddressClients, AddressClientsControllers.createAddressClient);
router.get('/', AddressClientsControllers.getAllAddressClients);
router.put('/:id', AddressClientsMiddlewares.validateUpdateAddressClients, AddressClientsControllers.updateAddressClient);
router.delete('/:id', AddressClientsMiddlewares.validateDeleteAddressClients, AddressClientsControllers.deleteAddressClient);

module.exports = router;