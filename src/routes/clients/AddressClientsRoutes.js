const express = require("express");
const router = express.Router();
const AddressClientsControllers = require("../../controllers/clients/AddressClientsControllers");
const AddressClientsMiddlewares = require("../../middlewares/clients/AddressClientsMiddlewares");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas para direcciones de clientes
router.post(
  "/",
  permissionMiddleware("Clientes", "Editar"),
  AddressClientsMiddlewares.validateCreateAddressClients,
  AddressClientsControllers.createAddressClient
);
router.get("/", permissionMiddleware("Clientes", "Ver"), AddressClientsControllers.getAllAddressClients);
router.put(
  "/:id",
  permissionMiddleware("Clientes", "Editar"),
  AddressClientsMiddlewares.validateUpdateAddressClients,
  AddressClientsControllers.updateAddressClient
);
router.delete(
  "/:id",
  permissionMiddleware("Clientes", "Eliminar"),
  AddressClientsMiddlewares.validateDeleteAddressClients,
  AddressClientsControllers.deleteAddressClient
);

module.exports = router;
