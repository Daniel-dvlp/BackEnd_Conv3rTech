const express = require("express");
const router = express.Router();
const ClientsControllers = require("../../controllers/clients/ClientsControllers");
const ClientsMiddlewares = require("../../middlewares/clients/ClientsMiddlewares");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas para clientes (todas requieren autenticación)
router.post(
  "/",
  ClientsMiddlewares.normalizeClientPayload,
  ClientsMiddlewares.validateCreateClients,
  ClientsControllers.createClient
);
router.get("/", ClientsControllers.getAllClients);
router.get(
  "/:id",
  ClientsMiddlewares.validateGetClientById,
  ClientsControllers.getClientById
);
router.get("/search/:term", ClientsControllers.searchClients);
router.put(
  "/:id/credit",
  ClientsMiddlewares.validateChangeClientCredit,
  ClientsControllers.changeClientCredit
);
router.put(
  "/:id/status",
  ClientsMiddlewares.validateChangeClientStatus,
  ClientsControllers.changeClientStatus
);
router.put(
  "/:id",
  ClientsMiddlewares.normalizeClientPayload,
  ClientsMiddlewares.validateUpdateClients,
  ClientsControllers.updateClient
);
router.delete(
  "/:id",
  ClientsMiddlewares.validateDeleteClients,
  ClientsControllers.deleteClient
);

module.exports = router;
