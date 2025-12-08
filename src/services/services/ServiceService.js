const Service = require('../../models/services/Service');

const createService = async (data) => {
    return await Service.create(data);
};

const getAllServices = async (query = {}) => {
    const whereClause = {};
    
    // Si se solicita filtrar por estado (ej: solo activos)
    if (query.estado) {
        whereClause.estado = query.estado;
    }

    return await Service.findAll({ 
        where: whereClause,
        include: 'categoria' 
    });
};

const getServiceById = async (id) => {
    return await Service.findOne({
        where: { id_servicio: id },
        include: 'categoria'
    });
};

const updateService = async (id, data) => {
    // Primero verificar que el servicio existe
    const existingService = await Service.findOne({ where: { id_servicio: id } });
    if (!existingService) {
        throw new Error('Servicio no encontrado');
    }
    
    // Actualizar el servicio
    await Service.update(data, { where: { id_servicio: id } });
    
    // Retornar el servicio actualizado con la categoría
    return await Service.findOne({ 
        where: { id_servicio: id }, 
        include: 'categoria' 
    });
};

const deleteService = async (id) => {
    // 1. Validar si está en cotizaciones
    const QuoteDetail = require('../../models/quotes/QuoteDetails');
    const inQuote = await QuoteDetail.findOne({ where: { id_servicio: id } });
    if (inQuote) {
        const error = new Error("No se puede eliminar el servicio porque está incluido en una cotización.");
        error.statusCode = 400;
        throw error;
    }

    // 2. Validar si está en proyectos (General)
    const ProjectServicio = require('../../models/projects/ProjectServicio');
    const inProject = await ProjectServicio.findOne({ where: { id_servicio: id } });
    if (inProject) {
        const error = new Error("No se puede eliminar el servicio porque está asignado a un proyecto.");
        error.statusCode = 400;
        throw error;
    }

    // 3. Validar si está en sedes de proyectos (Asignación específica)
    const SedeServicio = require('../../models/projects/SedeServicio');
    const inSede = await SedeServicio.findOne({ where: { id_servicio: id } });
    if (inSede) {
        const error = new Error("No se puede eliminar el servicio porque está asignado a una sede de proyecto.");
        error.statusCode = 400;
        throw error;
    }

    return await Service.destroy({ where: { id_servicio: id } });
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
