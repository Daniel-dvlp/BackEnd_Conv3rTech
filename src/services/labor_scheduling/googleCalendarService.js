const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

// Inicializar cliente de Google Calendar con Service Account
let calendar = null;

const initializeCalendar = () => {
  if (calendar) return calendar;

  try {
    // Cargar credenciales desde variable de entorno o archivo
    const credentialsPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH
      ? path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH)
      : path.join(__dirname, '../../', process.env.GOOGLE_SERVICE_ACCOUNT_JSON || 'proyecto-convertech-2f43c1daa2ef.json');

    let credentials;
    
    // Intentar cargar desde variable de entorno (para producción)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    } else {
      // Cargar desde archivo
      credentials = require(credentialsPath);
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    calendar = google.calendar({ version: 'v3', auth });
    return calendar;
  } catch (error) {
    console.error('Error inicializando Google Calendar:', error);
    throw new Error('No se pudo inicializar Google Calendar. Verifica las credenciales.');
  }
};

/**
 * Crea un evento recurrente en Google Calendar
 * @param {string} calendarId - ID del calendario
 * @param {Object} payload - Datos del evento
 * @returns {Promise<Object>} Evento creado
 */
const createRecurringEvent = async (calendarId, payload) => {
  try {
    const cal = initializeCalendar();
    
    const event = {
      summary: payload.summary || 'Programación Laboral',
      description: payload.description || '',
      start: {
        dateTime: payload.startDateTime,
        timeZone: payload.timeZone || 'America/Bogota',
      },
      end: {
        dateTime: payload.endDateTime,
        timeZone: payload.timeZone || 'America/Bogota',
      },
      colorId: payload.colorId || '1', // 1=azul (turno), 2=verde (libre), 11=rojo (falta), 5=amarillo (especial)
      extendedProperties: {
        private: {
          userId: payload.userId?.toString() || '',
          eventType: payload.eventType || 'shift',
        },
      },
    };

    // Agregar recurrencia si se especifica
    if (payload.recurrence) {
      event.recurrence = payload.recurrence;
    }

    const response = await cal.events.insert({
      calendarId,
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creando evento recurrente:', error);
    throw new Error(`Error al crear evento en Google Calendar: ${error.message}`);
  }
};

/**
 * Actualiza un evento en Google Calendar
 * @param {string} calendarId - ID del calendario
 * @param {string} eventId - ID del evento
 * @param {Object} payload - Datos actualizados
 * @returns {Promise<Object>} Evento actualizado
 */
const updateEvent = async (calendarId, eventId, payload) => {
  try {
    const cal = initializeCalendar();

    // Obtener evento existente
    const existingEvent = await cal.events.get({
      calendarId,
      eventId,
    });

    const event = existingEvent.data;

    // Actualizar campos
    if (payload.summary !== undefined) event.summary = payload.summary;
    if (payload.description !== undefined) event.description = payload.description;
    if (payload.startDateTime) {
      event.start = {
        dateTime: payload.startDateTime,
        timeZone: payload.timeZone || event.start.timeZone || 'America/Bogota',
      };
    }
    if (payload.endDateTime) {
      event.end = {
        dateTime: payload.endDateTime,
        timeZone: payload.timeZone || event.end.timeZone || 'America/Bogota',
      };
    }
    if (payload.colorId !== undefined) event.colorId = payload.colorId;
    if (payload.recurrence !== undefined) {
      if (payload.recurrence === null) {
        delete event.recurrence;
      } else {
        event.recurrence = payload.recurrence;
      }
    }

    // Actualizar extendedProperties
    if (payload.userId !== undefined) {
      event.extendedProperties = event.extendedProperties || {};
      event.extendedProperties.private = event.extendedProperties.private || {};
      event.extendedProperties.private.userId = payload.userId.toString();
    }
    if (payload.eventType !== undefined) {
      event.extendedProperties = event.extendedProperties || {};
      event.extendedProperties.private = event.extendedProperties.private || {};
      event.extendedProperties.private.eventType = payload.eventType;
    }

    const response = await cal.events.update({
      calendarId,
      eventId,
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error actualizando evento:', error);
    throw new Error(`Error al actualizar evento en Google Calendar: ${error.message}`);
  }
};

/**
 * Elimina un evento en Google Calendar
 * @param {string} calendarId - ID del calendario
 * @param {string} eventId - ID del evento
 * @param {boolean} sendUpdates - Si se envían notificaciones (opcional)
 * @returns {Promise<void>}
 */
const deleteEvent = async (calendarId, eventId, sendUpdates = 'none') => {
  try {
    const cal = initializeCalendar();

    await cal.events.delete({
      calendarId,
      eventId,
      sendUpdates,
    });

    return { success: true };
  } catch (error) {
    console.error('Error eliminando evento:', error);
    throw new Error(`Error al eliminar evento en Google Calendar: ${error.message}`);
  }
};

/**
 * Lista eventos de un calendario
 * @param {string} calendarId - ID del calendario
 * @param {string} timeMin - Fecha/hora mínima (ISO 8601)
 * @param {string} timeMax - Fecha/hora máxima (ISO 8601)
 * @param {string} q - Búsqueda de texto (opcional)
 * @param {Object} otherFilters - Otros filtros (opcional)
 * @returns {Promise<Array>} Lista de eventos
 */
const listEvents = async (calendarId, timeMin, timeMax, q = null, otherFilters = {}) => {
  try {
    const cal = initializeCalendar();

    const params = {
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: otherFilters.maxResults || 2500,
    };

    if (q) {
      params.q = q;
    }

    const response = await cal.events.list(params);

    return response.data.items || [];
  } catch (error) {
    console.error('Error listando eventos:', error);
    throw new Error(`Error al listar eventos de Google Calendar: ${error.message}`);
  }
};

/**
 * Obtiene un evento específico
 * @param {string} calendarId - ID del calendario
 * @param {string} eventId - ID del evento
 * @returns {Promise<Object>} Evento
 */
const getEvent = async (calendarId, eventId) => {
  try {
    const cal = initializeCalendar();

    const response = await cal.events.get({
      calendarId,
      eventId,
    });

    return response.data;
  } catch (error) {
    console.error('Error obteniendo evento:', error);
    throw new Error(`Error al obtener evento de Google Calendar: ${error.message}`);
  }
};

/**
 * Genera regla de recurrencia RRULE para días de la semana
 * @param {Array<string>} daysOfWeek - Días de la semana ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} untilDate - Fecha de fin (opcional)
 * @returns {string} Regla RRULE
 */
const generateRRULE = (daysOfWeek, startDate, untilDate = null) => {
  if (!daysOfWeek || daysOfWeek.length === 0) {
    throw new Error('Se requiere al menos un día de la semana');
  }

  const days = daysOfWeek.join(',');
  let rrule = `RRULE:FREQ=WEEKLY;BYDAY=${days}`;

  if (untilDate) {
    const untilStr = untilDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    rrule += `;UNTIL=${untilStr}`;
  }

  return rrule;
};

/**
 * Convierte nombre de día en español a código RRULE
 * @param {string} dayName - Nombre del día en español
 * @returns {string} Código RRULE
 */
const dayNameToRRULE = (dayName) => {
  const mapping = {
    'Lunes': 'MO',
    'Martes': 'TU',
    'Miércoles': 'WE',
    'Jueves': 'TH',
    'Viernes': 'FR',
    'Sábado': 'SA',
    'Domingo': 'SU',
  };
  return mapping[dayName] || dayName;
};

module.exports = {
  createRecurringEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  getEvent,
  generateRRULE,
  dayNameToRRULE,
  initializeCalendar,
};

