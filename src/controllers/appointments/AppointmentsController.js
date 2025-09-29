const appointmentService = require("../../services/appointments/AppointmentService");

class AppointmentController {
  async getAll(req, res) {
    try {
      const citas = await appointmentService.getAppointments();
      res.json(citas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const cita = await appointmentService.getAppointmentById(req.params.id);
      res.json(cita);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const cita = await appointmentService.createAppointment(req.body);
      res.status(201).json(cita);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      await appointmentService.updateAppointment(req.params.id, req.body);
      res.json({ message: "Cita actualizada" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await appointmentService.deleteAppointment(req.params.id);
      res.json({ message: "Cita eliminada" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AppointmentController();
