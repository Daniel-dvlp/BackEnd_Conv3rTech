const LaborScheduling = require('../../models/labor_scheduling/ProgramacionModel');
const User = require('../../models/users/Users');
const { Op } = require('sequelize');

/**
 * Crea una nueva programación laboral
 * @param {Object} schedulingData - Datos de la programación
 * @returns {Promise<Object>} - Programación creada
 */
const createLaborScheduling = async (schedulingData) => {
    return LaborScheduling.create(schedulingData);
};

/**
 * Obtiene todas las programaciones laborales con filtros
 * @param {Object} filters - Filtros de búsqueda (usuario_id, includeAnnulled)
 * @returns {Promise<Array>} - Lista de programaciones
 */
const getAllLaborSchedulings = async (filters = {}) => {
    const whereClause = {};
    
    // Filtro por usuario (para rol Técnico o filtrado específico)
    if (filters.usuario_id) {
        whereClause.usuario_id = filters.usuario_id;
    }
    
    // Filtro por estado (por defecto solo Activas)
    if (!filters.includeAnnulled) {
        whereClause.estado = 'Activa';
    }

    return LaborScheduling.findAll({
        where: whereClause,
        include: [{
            model: User,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'apellido', 'documento', 'tipo_documento', 'estado_usuario']
        }],
        order: [['fecha_inicio', 'DESC']]
    });
};

/**
 * Obtiene una programación por ID con validación de existencia
 * @param {number} id - ID de la programación
 * @returns {Promise<Object|null>} - Programación encontrada o null
 */
const getLaborSchedulingById = async (id) => {
    return LaborScheduling.findByPk(id, {
        include: [{
            model: User,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'apellido', 'documento', 'tipo_documento']
        }]
    });
};

/**
 * Actualiza una programación existente
 * @param {number} id - ID de la programación
 * @param {Object} schedulingData - Datos a actualizar
 * @returns {Promise<Object>} - Programación actualizada
 */
const updateLaborScheduling = async (id, schedulingData) => {
    const scheduling = await LaborScheduling.findByPk(id);
    if (!scheduling) {
        throw new Error('Programación laboral no encontrada');
    }
    return scheduling.update(schedulingData);
};

/**
 * Elimina físicamente una programación (Solo Admin)
 * @param {number} id - ID de la programación
 * @returns {Promise<void>}
 */
const deleteLaborScheduling = async (id) => {
    const scheduling = await LaborScheduling.findByPk(id);
    if (!scheduling) {
        throw new Error('Programación laboral no encontrada');
    }
    return scheduling.destroy();
};

/**
 * Anula una programación (borrado lógico)
 * @param {number} id - ID de la programación
 * @param {string} motivo - Motivo de la anulación
 * @returns {Promise<Object>} - Programación anulada
 */
const annulLaborScheduling = async (id, motivo) => {
    const scheduling = await LaborScheduling.findByPk(id);
    if (!scheduling) {
        throw new Error('Programación laboral no encontrada');
    }
    return scheduling.update({
        estado: 'Anulada',
        motivo_anulacion: motivo
    });
};

module.exports = {
    createLaborScheduling,
    getAllLaborSchedulings,
    getLaborSchedulingById,
    updateLaborScheduling,
    deleteLaborScheduling,
    annulLaborScheduling
};