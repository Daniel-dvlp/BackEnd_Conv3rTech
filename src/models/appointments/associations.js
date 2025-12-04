const Appointment = require('./Appointments');
const Client = require("../clients/Clients");
const User = require("../users/Users");
const Service = require("../services/Service");
const AddressClients = require("../clients/AddressClients");

// Asociaciones
Appointment.belongsTo(User, {
  foreignKey: "id_usuario",
  as: "trabajador",
});

Appointment.belongsTo(Client, {
  foreignKey: "id_cliente",
  as: "cliente",
});

Appointment.belongsTo(Service, {
  foreignKey: "id_servicio",
  as: "servicio",
});

Appointment.belongsTo(AddressClients, {
  foreignKey: "id_direccion",
  as: "direccion_cliente",
});

module.exports = {
  Appointment
};
