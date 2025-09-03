const { validationResult } = require('express-validator');
const categoryService = require('../../services/products_category/ProductsCategoryService');

const createCategory = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ message: 'Categoría creada exitosamente', data: category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        if (categories.length === 0) {
            return res.status(200).json({ message: 'No hay categorías registradas', data: [] });
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCategoryById = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateCategory = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await categoryService.updateCategory(req.params.id, req.body);
        res.status(201).json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(201).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const changeStateCategory = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await categoryService.changeStateCategory(req.params.id, req.body.state);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    changeStateCategory,
};