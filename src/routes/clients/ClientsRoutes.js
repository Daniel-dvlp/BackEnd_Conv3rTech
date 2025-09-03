const express = require('express');
const router = express.Router();
const ClientsControllers = require('../../controllers/clients/ClientsControllers');
const ClientsMiddlewares = require('../../middlewares/clients/ClientsMiddlewares');
const { authMiddleware } = require('../../middlewares/auth/AuthMiddleware');

// Rutas para clientes (todas requieren autenticación)
router.post('/', authMiddleware, ClientsMiddlewares.normalizeClientPayload, ClientsMiddlewares.validateCreateClients, ClientsControllers.createClient);
router.get('/', authMiddleware, ClientsControllers.getAllClients);
router.get('/:id', authMiddleware, ClientsMiddlewares.validateGetClientById, ClientsControllers.getClientById);
router.get('/search/:term', authMiddleware, ClientsControllers.searchClients);
router.put('/:id/credit', authMiddleware, ClientsMiddlewares.validateChangeClientCredit, ClientsControllers.changeClientCredit);
router.put('/:id/status', authMiddleware, ClientsMiddlewares.validateChangeClientStatus, ClientsControllers.changeClientStatus);
router.put('/:id', authMiddleware, ClientsMiddlewares.normalizeClientPayload, ClientsMiddlewares.validateUpdateClients, ClientsControllers.updateClient);
router.delete('/:id', authMiddleware, ClientsMiddlewares.validateDeleteClients, ClientsControllers.deleteClient);

module.exports = router;