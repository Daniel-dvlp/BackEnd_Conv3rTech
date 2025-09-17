const Appointment = require("../models/appointments/Appointment");
const User = require("../models/auth/User");
const Client = require("../models/clients/Clients");
const Service = require("../models/services/Service");

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
          attributes: ["id", "nombre", "descripcion", "precio"], // ajusta los campos que tengas
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
          attributes: ["id", "nombre", "descripcion", "precio"],
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
