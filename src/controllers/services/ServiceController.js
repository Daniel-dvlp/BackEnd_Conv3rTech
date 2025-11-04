const { validationResult } = require('express-validator');
const serviceService = require('../../services/services/ServiceService');


const createService = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newService = await serviceService.createService(req.body);
        res.status(201).json({ message: 'Servicio creado exitosamente.', service: newService });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await serviceService.getAllServices();
        res.status(200).json({
            success: true,
            data: services,
            message: "Servicios obtenidos exitosamente"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getServiceById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const service = await serviceService.getServiceById(req.params.id);
        res.status(200).json({
            success: true,
            data: service,
            message: "Servicio obtenido exitosamente"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const updateService = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedService = await serviceService.updateService(req.params.id, req.body);
        res.status(200).json({ message: 'Servicio actualizado exitosamente.', service: updatedService });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await serviceService.deleteService(req.params.id);
        res.status(200).json({ message: 'Servicio eliminado exitosamente.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};
