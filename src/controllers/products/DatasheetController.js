const { validationResult } = require('express-validator');
const datasheetService = require('../../services/products/DatasheetService');

const createDatasheet = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const datasheet = await datasheetService.createDatasheet(req.body);
        res.status(201).json({ message: 'Ficha técnica creada exitosamente', data: datasheet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllDatasheets = async (req, res) => {
    try {
        const datasheets = await datasheetService.getAllDatasheets();
        if (datasheets.length === 0) {
            return res.status(200).json({ message: 'No hay fichas técnicas registradas', data: [] });
        }
        res.status(200).json(datasheets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDatasheetById = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const datasheet = await datasheetService.getDatasheetById(req.params.id);
        res.status(200).json(datasheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateDatasheet = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await datasheetService.updateDatasheet(req.params.id, req.body);
        res.status(201).json({ message: 'Ficha técnica actualizada exitosamente'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDatasheet = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await datasheetService.deleteDatasheet(req.params.id);
        res.status(201).json({ message: 'Ficha técnica eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createDatasheet,
    getAllDatasheets,
    getDatasheetById,
    updateDatasheet,
    deleteDatasheet
};
