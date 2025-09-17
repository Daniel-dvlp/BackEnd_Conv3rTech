const appointmentRepository = require("../repositories/AppointmentRepository");

class AppointmentService {
  async getAppointments() {
    return await appointmentRepository.findAll();
  }

  async getAppointmentById(id) {
    const cita = await appointmentRepository.findById(id);
    if (!cita) throw new Error("Cita no encontrada");
    return cita;
  }

  async createAppointment(data) {
    // Aquí puedes agregar reglas de negocio:
    // - Validar que cliente, usuario y servicio existan
    // - Validar solapamiento de horarios para el trabajador

    return await appointmentRepository.create(data);
  }

  async updateAppointment(id, data) {
    return await appointmentRepository.update(id, data);
  }

  async deleteAppointment(id) {
    return await appointmentRepository.delete(id);
  }
}

module.exports = new AppointmentService();
