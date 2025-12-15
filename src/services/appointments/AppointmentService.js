const appointmentRepository = require("../../repositories/appointments/AppointmentRepository");
const { Programacion } = require("../../models/labor_scheduling/associations");
const { Op } = require("sequelize");

class AppointmentService {
  async getAppointments(filters = {}) {
    return await appointmentRepository.findAll(filters);
  }

  async getAppointmentById(id) {
    const cita = await appointmentRepository.findById(id);
    if (!cita) throw new Error("Cita no encontrada");
    return cita;
  }

  async createAppointment(data) {
    // 📌 Reglas de negocio al crear una cita

    // 1. Validar campos obligatorios
    const { id_cliente, id_usuario, id_servicio, fecha, hora_inicio, hora_fin, id_direccion } = data;
    
    // Validamos campos básicos. id_direccion es opcional en BD pero requerido por negocio si se quiere asignar dirección.
    // El usuario pidió "se le asigna a un cliente y la direccion del cliente", así que lo haremos requerido si no envían "direccion" texto.
    if (!id_cliente || !id_usuario || !id_servicio || !fecha || !hora_inicio || !hora_fin) {
      throw new Error("Todos los campos obligatorios deben ser proporcionados (cliente, usuario, servicio, fecha, horas)");
    }

    if (!id_direccion && !data.direccion) {
        throw new Error("Debe proporcionar una dirección (id_direccion o texto)");
    }

    // 2. Validar que hora_fin sea posterior a hora_inicio
    if (hora_inicio >= hora_fin) {
      throw new Error("La hora de fin debe ser posterior a la hora de inicio");
    }

    // 3. Validar horario laboral del trabajador
    await this.validateWorkingHours(id_usuario, fecha, hora_inicio, hora_fin);

    // 4. Validar solapamiento de citas del trabajador
    await this.validateAppointmentOverlap(id_usuario, fecha, hora_inicio, hora_fin);

    // 5. Estado inicial de la cita
    data.estado = data.estado || "Pendiente";

    return await appointmentRepository.create(data);
  }

  async updateAppointment(id, data) {
    // 📌 Reglas de negocio al actualizar una cita

    const citaExistente = await appointmentRepository.findById(id);
    if (!citaExistente) throw new Error("Cita no encontrada");

    // Si la cita ya está completada, no se debería editar salvo quizás por un admin, pero por regla general:
    if (citaExistente.estado === "Completada") {
       // Si solo estamos subiendo foto o notas adicionales podría permitirse, pero si intentamos cambiar hora/fecha no.
       if (data.fecha || data.hora_inicio || data.hora_fin) {
           throw new Error("No se puede modificar fecha/hora de una cita Completada");
       }
    }

    if (citaExistente.estado === "Cancelada") {
      throw new Error("No se puede modificar una cita Cancelada");
    }

    // Validación de cambio de estado a Completada
    if (data.estado === "Completada" && citaExistente.estado !== "Completada") {
        // Requisito: "una cita puede cambiar a estar completada cuando el tecnico suba la foto"
        if (!data.evidencia_foto && !citaExistente.evidencia_foto) {
            throw new Error("Para completar la cita, es obligatorio subir la evidencia fotográfica.");
        }
    }

    // Si se están actualizando fecha/hora, validar horario laboral y solapamiento
    if (data.fecha || data.hora_inicio || data.hora_fin || data.id_usuario) {
      const fecha = data.fecha || citaExistente.fecha;
      const hora_inicio = data.hora_inicio || citaExistente.hora_inicio;
      const hora_fin = data.hora_fin || citaExistente.hora_fin;
      const id_usuario = data.id_usuario || citaExistente.id_usuario;

      // Validar que hora_fin sea posterior a hora_inicio
      if (hora_inicio >= hora_fin) {
        throw new Error("La hora de fin debe ser posterior a la hora de inicio");
      }

      // Validar horario laboral
      await this.validateWorkingHours(id_usuario, fecha, hora_inicio, hora_fin);

      // Validar solapamiento (excluyendo la cita actual)
      await this.validateAppointmentOverlap(id_usuario, fecha, hora_inicio, hora_fin, id);
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

    // Validar que falten más de 3 horas para la cita (solo si es futura)
    const ahora = new Date();
    const fechaHoraCita = new Date(`${citaExistente.fecha}T${citaExistente.hora_inicio}`);
    
    // Si la cita es futura, validar el tiempo mínimo de cancelación
    if (fechaHoraCita > ahora) {
      const diferenciaHoras = (fechaHoraCita - ahora) / (1000 * 60 * 60);
      if (diferenciaHoras < 3) {
        throw new Error("No se puede eliminar una cita faltando menos de 3 horas para su realización");
      }
    }

    return await appointmentRepository.delete(id);
  }

  /**
   * Valida que la cita esté dentro del horario laboral del trabajador
   */
  async validateWorkingHours(id_usuario, fecha, hora_inicio, hora_fin) {
    // Obtener programación activa del trabajador
    const programacion = await Programacion.findOne({
      where: {
        usuario_id: id_usuario,
        estado: "Activa",
        fecha_inicio: {
          [Op.lte]: fecha // La programación debe haber iniciado antes o en la fecha de la cita
        }
      },
      order: [['fecha_inicio', 'DESC']]
    });

    if (!programacion) {
      throw new Error("El trabajador no tiene una programación laboral activa para esta fecha");
    }

    // Obtener el día de la semana (en español)
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const fechaObj = new Date(fecha + 'T00:00:00');
    const diaSemana = diasSemana[fechaObj.getDay()];

    // Obtener bloques horarios del día
    const bloquesDelDia = programacion.dias[diaSemana];

    if (!bloquesDelDia || bloquesDelDia.length === 0) {
      throw new Error(`El trabajador no tiene horario laboral configurado para ${diaSemana}`);
    }

    // Validar que hora_inicio y hora_fin estén dentro de algún bloque
    const dentroDeHorario = bloquesDelDia.some(bloque => {
      const bloqueInicio = bloque.horaInicio;
      const bloqueFin = bloque.horaFin;

      // Convertir a formato comparable (HH:MM:SS)
      const inicio = this.normalizeTime(hora_inicio);
      const fin = this.normalizeTime(hora_fin);
      const bInicio = this.normalizeTime(bloqueInicio);
      const bFin = this.normalizeTime(bloqueFin);

      return inicio >= bInicio && fin <= bFin;
    });

    if (!dentroDeHorario) {
      throw new Error("La cita debe estar dentro del horario laboral del trabajador");
    }
  }

  /**
   * Valida que no haya solapamiento con otras citas del mismo trabajador
   */
  async validateAppointmentOverlap(id_usuario, fecha, hora_inicio, hora_fin, excludeId = null) {
    const citasExistentes = await appointmentRepository.findAll();
    const excludeNumericId = excludeId ? Number(excludeId) : null;

    const conflicto = citasExistentes.find(cita => {
      // Excluir la cita actual si estamos editando
      if (excludeNumericId && cita.id_cita === excludeNumericId) return false;

      // Solo verificar citas del mismo trabajador en la misma fecha
      if (cita.id_usuario !== id_usuario || cita.fecha !== fecha) return false;

      // Verificar solapamiento de horarios
      const citaInicio = this.normalizeTime(cita.hora_inicio);
      const citaFin = this.normalizeTime(cita.hora_fin);
      const nuevaInicio = this.normalizeTime(hora_inicio);
      const nuevaFin = this.normalizeTime(hora_fin);

      // Hay solapamiento si:
      // - La nueva cita inicia durante una cita existente
      // - La nueva cita termina durante una cita existente
      // - La nueva cita contiene completamente una cita existente
      return (
        (nuevaInicio >= citaInicio && nuevaInicio < citaFin) ||
        (nuevaFin > citaInicio && nuevaFin <= citaFin) ||
        (nuevaInicio <= citaInicio && nuevaFin >= citaFin)
      );
    });

    if (conflicto) {
      throw new Error("El trabajador ya tiene una cita en ese horario");
    }
  }

  /**
   * Normaliza el formato de hora a HH:MM:SS para comparaciones
   */
  normalizeTime(time) {
    if (!time) return "00:00:00";

    // Si ya tiene formato HH:MM:SS, retornar
    if (time.length === 8 && time.split(':').length === 3) {
      return time;
    }

    // Si tiene formato HH:MM, agregar :00
    if (time.length === 5 && time.split(':').length === 2) {
      return `${time}:00`;
    }

    return time;
  }
}

module.exports = new AppointmentService();
