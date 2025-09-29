const appointmentRepository = require("../../repositories/appointments/AppointmentRepository");

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
    // 📌 Reglas de negocio al crear una cita

    // 1. Validar campos obligatorios
    const { cliente, telefono, servicio, direccion, fechaHora, encargado } = data;
    if (!cliente || !telefono || !servicio || !direccion || !fechaHora || !encargado) {
      throw new Error("Todos los campos son obligatorios");
    }

    // 2. Validar teléfono (solo números y mínimo 10 dígitos)
    if (!/^\d{10,}$/.test(telefono)) {
      throw new Error("El teléfono debe tener al menos 10 dígitos numéricos");
    }

    // 3. Validar horario laboral (ejemplo: 8:00 a 18:00)
    const hora = new Date(fechaHora).getHours();
    if (hora < 8 || hora > 18) {
      throw new Error("La cita debe estar dentro del horario laboral (8:00 - 18:00)");
    }

    // 4. Validar solapamiento de citas del encargado
    const citasExistentes = await appointmentRepository.findAll();
    const conflicto = citasExistentes.find(
      (c) => c.encargado === encargado && new Date(c.fechaHora).getTime() === new Date(fechaHora).getTime()
    );
    if (conflicto) {
      throw new Error("El encargado ya tiene una cita en esa fecha y hora");
    }

    // 5. Estado inicial de la cita
    data.estado = "Pendiente";

    return await appointmentRepository.create(data);
  }

  async updateAppointment(id, data) {
    // 📌 Reglas de negocio al actualizar una cita

    const citaExistente = await appointmentRepository.findById(id);
    if (!citaExistente) throw new Error("Cita no encontrada");

    // Solo se permite editar si está Pendiente o Confirmada
    if (["Completada", "Cancelada"].includes(citaExistente.estado)) {
      throw new Error("No se puede modificar una cita Completada o Cancelada");
    }

    // Validar teléfono en caso de actualización
    if (data.telefono && !/^\d{10,}$/.test(data.telefono)) {
      throw new Error("El teléfono debe tener al menos 10 dígitos numéricos");
    }

    return await appointmentRepository.update(id, data);
  }

  async deleteAppointment(id) {
    // 📌 Reglas de negocio al eliminar una cita

    const citaExistente = await appointmentRepository.findById(id);
    if (!citaExistente) throw new Error("Cita no encontrada");

    // Solo se puede eliminar si no ha sido atendida
    if (["Completada", "Cancelada"].includes(citaExistente.estado)) {
      throw new Error("No se puede eliminar una cita Completada o Cancelada");
    }

    return await appointmentRepository.delete(id);
  }
}

module.exports = new AppointmentService();
