const appointmentService = require("../../services/appointments/AppointmentService");

class AppointmentController {
  async getAll(req, res) {
    try {
      const filters = {};
      
      // Si es Técnico (id_rol 3), solo ve sus citas
      if (req.user && req.user.id_rol === 3) { 
        filters.id_usuario = req.user.id_usuario;
      }
      // Coordinador (2) y Admin (1) ven todas

      const citas = await appointmentService.getAppointments(filters);
      res.json(citas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const cita = await appointmentService.getAppointmentById(req.params.id);
      
      // Si es técnico (3), verificar que sea su cita
      if (req.user && req.user.id_rol === 3) {
         if (cita.trabajador.id_usuario !== req.user.id_usuario) {
             return res.status(403).json({ error: "No tienes permiso para ver esta cita" });
         }
      }

      res.json(cita);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
       // Solo Admin (1) y Coordinador (2) pueden crear. Técnico (3) NO.
       if (req.user && ![1, 2].includes(req.user.id_rol)) {
           return res.status(403).json({ error: "No tienes permisos para crear citas" });
       }

      const cita = await appointmentService.createAppointment(req.body);
      res.status(201).json(cita);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      // Tecnico (3) solo puede actualizar si es su cita (y si tiene permisos, usualmente no editan citas completas)
      // Asumamos que Técnico tiene restricciones mayores o solo puede editar ciertas cosas, 
      // pero aquí mantendremos la lógica de propiedad.
      if (req.user && req.user.id_rol === 3) {
          const cita = await appointmentService.getAppointmentById(req.params.id);
          if (cita.trabajador.id_usuario !== req.user.id_usuario) {
              return res.status(403).json({ error: "No tienes permiso para editar esta cita" });
          }
          // Tecnico no puede reasignar usuario
          if (req.body.id_usuario && req.body.id_usuario !== req.user.id_usuario) {
               return res.status(403).json({ error: "No puedes reasignar la cita" });
          }
      }

      // Coordinador (2) y Admin (1) pueden actualizar sin restricción


      await appointmentService.updateAppointment(req.params.id, req.body);
      res.json({ message: "Cita actualizada" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      // Solo Admin (1) puede eliminar
      if (req.user && req.user.id_rol !== 1) {
          return res.status(403).json({ error: "Solo administradores pueden eliminar citas" });
      }

      await appointmentService.deleteAppointment(req.params.id);
      res.json({ message: "Cita eliminada" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AppointmentController();
