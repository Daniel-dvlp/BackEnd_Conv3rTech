const { validationResult } = require('express-validator');
const featureService = require('../../services/products/FeatureService');

const createFeature = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const feature = await featureService.createFeature(req.body);
        res.status(201).json({ message: 'Característica creada exitosamente', data: feature });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllFeatures = async (req, res) => {
    try {
        const features = await featureService.getAllFeatures();
        if (features.length === 0) {
            return res.status(200).json({ message: 'No hay características registradas', data: [] });
        }
        res.status(200).json(features);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFeatureById = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const feature = await featureService.getFeatureById(req.params.id);
        res.status(200).json(feature);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFeature = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await featureService.updateFeature(req.params.id, req.body);
        res.status(201).json({ message: 'Característica actualizada exitosamente'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteFeature = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await featureService.deleteFeature(req.params.id);
        res.status(201).json({ message: 'Característica eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createFeature,
    getAllFeatures,
    getFeatureById,
    updateFeature,
    deleteFeature
};
