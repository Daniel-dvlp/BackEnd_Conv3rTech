const { validationResult } = require('express-validator');
const serviceCategoryService = require('../../services/service_categories/ServiceCategoryService'); // <-- RUTA CORREGIDA

const createCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newCategory = await serviceCategoryService.createCategory(req.body);
        res.status(201).json({ message: 'Categoría creada exitosamente.', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await serviceCategoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const category = await serviceCategoryService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedCategory = await serviceCategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({ message: 'Categoría actualizada exitosamente.', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await serviceCategoryService.deleteCategory(req.params.id);
        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};