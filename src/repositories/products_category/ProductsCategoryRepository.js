const Category = require('../../models/products_category/ProductsCategory');

const createCategory = async (category) => {
    return Category.create(category);
}

const getAllCategories = async () => {
    return Category.findAll();
}

const getCategoryById = async (id) => {
    return Category.findByPk(id);
}

const updateCategory = async (id, category) => {
    return Category.update(category, { where: { id_categoria: id } });
}

const deleteCategory = async (id) => {
    return Category.destroy({ where: { id_categoria: id } });
}

const changeStateCategory = async (id, state) => {
    return Category.update({ estado: state }, { where: { id_categoria: id } });
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    changeStateCategory,
};