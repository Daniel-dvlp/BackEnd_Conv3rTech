const Category = require('../../models/products_category/ProductsCategory');
const Product = require('../../models/products/Product');

const createCategory = async (category) => {
    return Category.create(category);
}

const getAllCategories = async () => {
    return Category.findAll({
        attributes: ['id_categoria', 'nombre', 'descripcion', 'estado'],
        raw: true
    });
}

const getCategoryById = async (id) => {
    return Category.findByPk(id);
}

const updateCategory = async (id, category) => {
    await Category.update(category, { where: { id_categoria: id } });
    return Category.findByPk(id);
}

const deleteCategory = async (id) => {
    const productsCount = await Product.count({ where: { id_categoria: id } });
    if (productsCount > 0) {
        throw new Error("Error, no puedes eliminar esta categoría porque tiene productos asociados.");
    }
    return Category.destroy({ where: { id_categoria: id } });
}

const changeStateCategory = async (id, state) => {
    if (state === false) {
        const activeProductsCount = await Product.count({ 
            where: { 
                id_categoria: id, 
                estado: true 
            } 
        });
        if (activeProductsCount > 0) {
            throw new Error("Error, no puedes desactivar esta categoría porque tiene productos asociados activos.");
        }
   }
    await Category.update({ estado: state }, { where: { id_categoria: id } });
    return Category.findByPk(id);
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    changeStateCategory,
};