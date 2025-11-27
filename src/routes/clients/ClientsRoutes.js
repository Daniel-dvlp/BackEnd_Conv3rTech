const express = require("express");
const router = express.Router();
const ClientsControllers = require("../../controllers/clients/ClientsControllers");
const ClientsMiddlewares = require("../../middlewares/clients/ClientsMiddlewares");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas para clientes (todas requieren autenticación)
router.post(
  "/",
  permissionMiddleware("Clientes", "Crear"),
  ClientsMiddlewares.normalizeClientPayload,
  ClientsMiddlewares.validateCreateClients,
  ClientsControllers.createClient
);
router.get("/", permissionMiddleware("Clientes", "Ver"), ClientsControllers.getAllClients);
router.get(
  "/:id",
  permissionMiddleware("Clientes", "Ver"),
  ClientsMiddlewares.validateGetClientById,
  ClientsControllers.getClientById
);
router.get("/search/:term", permissionMiddleware("Clientes", "Ver"), ClientsControllers.searchClients);
router.put(
  "/:id/credit",
  permissionMiddleware("Clientes", "Editar"),
  ClientsMiddlewares.validateChangeClientCredit,
  ClientsControllers.changeClientCredit
);
router.put(
  "/:id/status",
  permissionMiddleware("Clientes", "Editar"),
  ClientsMiddlewares.validateChangeClientStatus,
  ClientsControllers.changeClientStatus
);
router.put(
  "/:id",
  permissionMiddleware("Clientes", "Editar"),
  ClientsMiddlewares.normalizeClientPayload,
  ClientsMiddlewares.validateUpdateClients,
  ClientsControllers.updateClient
);
router.delete(
  "/:id",
  permissionMiddleware("Clientes", "Eliminar"),
  ClientsMiddlewares.validateDeleteClients,
  ClientsControllers.deleteClient
);

module.exports = router;
