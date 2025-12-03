// src/repositories/appointments/AppointmentRepository.js
const Appointment = require('../../models/appointments/Appointments');
const Client = require("../../models/clients/Clients");
const Service = require("../../models/services/Service");
const User = require("../../models/users/Users");
const AddressClients = require("../../models/clients/AddressClients"); // Importar modelo

class AppointmentRepository {
  async findAll() {
    return await Appointment.findAll({
      include: [
        {
          model: User,
          as: "trabajador",
          attributes: ["id_usuario", "nombre", "apellido", "correo"], // <-- ajusta según tu modelo User
        },
        {
          model: Client,
          as: "cliente",
          attributes: ["id_cliente", "nombre", "apellido", "telefono", "correo"],
        },
        {
          model: Service,
          as: "servicio",
          attributes: ["id_servicio", "nombre", "descripcion", "precio", "duracion"],
        },
        {
          model: AddressClients,
          as: "direccion_cliente",
          attributes: ["id_direccion", "nombre_direccion", "direccion", "ciudad"],
        },
      ],
    });
  }

  async findById(id) {
    return await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: "trabajador",
          attributes: ["id_usuario", "nombre", "apellido", "correo"],
        },
        {
          model: Client,
          as: "cliente",
          attributes: ["id_cliente", "nombre", "apellido", "telefono", "correo"],
        },
        {
          model: Service,
          as: "servicio",
          attributes: ["id_servicio", "nombre", "descripcion", "precio", "duracion"],
        },
        {
          model: AddressClients,
          as: "direccion_cliente",
          attributes: ["id_direccion", "nombre_direccion", "direccion", "ciudad"],
        },
      ],
    });
  }

  async create(data) {
    return await Appointment.create(data);
  }

  async update(id, data) {
    const cita = await Appointment.findByPk(id);
    if (!cita) throw new Error("Cita no encontrada");
    return await cita.update(data);
  }

  async delete(id) {
    const cita = await Appointment.findByPk(id);
    if (!cita) throw new Error("Cita no encontrada");
    return await cita.destroy();
  }
}

module.exports = new AppointmentRepository();
