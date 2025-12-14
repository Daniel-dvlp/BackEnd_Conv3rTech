const appointmentService = require("../../services/appointments/AppointmentService");

class AppointmentController {
  async getAll(req, res) {
    try {
      console.log("🔍 [AppointmentsController] GET / - User:", req.user);
      const filters = {};
      
      // Si es Técnico (id_rol 2), solo ve sus citas
      // Aseguramos conversión a número por si viene como string
      if (req.user && Number(req.user.id_rol) === 2) { 
        filters.id_usuario = req.user.id_usuario;
      }
      // Coordinador (3) y Admin (1) ven todas
      
      console.log("🔍 [AppointmentsController] Filters applied:", filters);

      const citas = await appointmentService.getAppointments(filters);
      console.log(`🔍 [AppointmentsController] Found ${citas.length} appointments`);
      res.json(citas);
    } catch (err) {
      console.error("❌ [AppointmentsController] Error:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const cita = await appointmentService.getAppointmentById(req.params.id);
      
      // Si es técnico (2), verificar que sea su cita
      if (req.user && Number(req.user.id_rol) === 2) {
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
       // Solo Admin (1) y Coordinador (3) pueden crear. Técnico (2) NO.
       const idRol = Number(req.user?.id_rol);
       
       console.log(`🔍 [AppointmentsController] Create - Request Body:`, JSON.stringify(req.body));
       console.log(`🔍 [AppointmentsController] Create - UserID: ${req.user?.id_usuario}, RoleID: ${idRol} (Type: ${typeof idRol})`);
       
       if (req.user && ![1, 3].includes(idRol)) {
           console.warn(`⛔ [AppointmentsController] 403 Forbidden - Role ${idRol} not allowed to create appointments. Allowed: [1, 3]`);
           return res.status(403).json({ error: "No tienes permisos para crear citas (Rol no autorizado)" });
       }

      console.log("✅ [AppointmentsController] Role authorized. Proceeding to service creation...");
      const cita = await appointmentService.createAppointment(req.body);
      console.log("✅ [AppointmentsController] Appointment created successfully:", cita.id_cita);
      res.status(201).json(cita);
    } catch (err) {
      console.error("❌ [AppointmentsController] Create Error:", err);
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const idRol = Number(req.user.id_rol);
      
      // Si es Técnico (ID 2 según seedAuth.js)
      if (req.user && idRol === 2) { 
          // 1. Buscar la cita para verificar que le pertenece
          const cita = await appointmentService.getAppointmentById(req.params.id);
          // Verificar si cita.trabajador existe y tiene id_usuario, o si la estructura es diferente
          // Asumimos que getAppointmentById devuelve 'trabajador' poblado según el código existente
          if (!cita.trabajador || cita.trabajador.id_usuario !== req.user.id_usuario) {
              return res.status(403).json({ error: "No puedes editar citas que no te pertenecen." });
          }

          // 2. Permitir SOLO cambiar estado y evidencia
          // Ignoramos cualquier otro campo que venga en el body
          const allowedUpdates = {};
          if (req.body.estado) allowedUpdates.estado = req.body.estado;
          if (req.body.evidencia_foto) allowedUpdates.evidencia_foto = req.body.evidencia_foto;

          if (Object.keys(allowedUpdates).length === 0) {
             return res.status(400).json({ error: "No se proporcionaron campos válidos para actualizar." });
          }

          await appointmentService.updateAppointment(req.params.id, allowedUpdates);
          return res.json({ message: "Estado de cita actualizado" });
      }

      // Lógica normal para Admin (1) / Coordinador (3)
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
