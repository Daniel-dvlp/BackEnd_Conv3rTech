const categoryRepository = require('../../repositories/products_category/ProductsCategoryRepository');

const createCategory = async (category) => {
    return categoryRepository.createCategory(category);
}

const getAllCategories = async () => {
    return categoryRepository.getAllCategories();
}

const getCategoryById = async (id) => {
    return categoryRepository.getCategoryById(id);
}

const updateCategory = async (id, category) => {
    return categoryRepository.updateCategory(id, category);
}

const deleteCategory = async (id) => {
    return categoryRepository.deleteCategory(id);
}

const changeSateCategory = async (id, state) => {
    return categoryRepository.changeSateCategory(id, state);
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    changeSateCategory,
};