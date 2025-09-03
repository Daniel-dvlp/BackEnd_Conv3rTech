const serviceCategoryRepository = require('../../repositories/service_categories/ServiceCategoryRepository'); // <-- RUTA CORREGIDA

const createCategory = async (categoryData) => {
    return await serviceCategoryRepository.create(categoryData);
};

const getAllCategories = async () => {
    return await serviceCategoryRepository.findAll();
};

const getCategoryById = async (id) => {
    return await serviceCategoryRepository.findById(id);
};

const updateCategory = async (id, categoryData) => {
    await serviceCategoryRepository.update(id, categoryData);
    return await serviceCategoryRepository.findById(id);
};

const deleteCategory = async (id) => {
    return await serviceCategoryRepository.remove(id);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};