const Product = require('../../models/products/Product');
const Category = require('../../models/products_category/ProductsCategory');
const Datasheet = require('../../models/products/Datasheet');
const Feature = require('../../models/products/Feature');

// Crear producto
const createProduct = async (product) => {
    return Product.create(product);
};

// Obtener todos los productos
const getAllProducts = async () => {
    return Product.findAll({
        include: [
            { model: Category, as: 'categoria' },
            {
                model: Datasheet,
                as: 'fichas_tecnicas',
                include: [
                    { model: Feature, as: 'caracteristica' } // cada ficha trae su característica
                ]
            }
        ]
    });
};

// Obtener producto por ID
const getProductById = async (id) => {
    return Product.findByPk(id, {
        include: [
            { association: 'categoria' },
            {
                association: 'fichas_tecnicas',
                include: [{ association: 'caracteristica' }]
            }
        ]
    });
};

// Obtener producto por ID (sin relaciones)
const getById = async (id) => {
    return Product.findByPk(id);
};

// Actualizar stock del producto
const updateStock = async (id, newStock) => {
    return Product.update(
        { stock: newStock },
        { where: { id_producto: id } }
    );
};

// Actualizar producto
const updateProduct = async (id, product) => {
    return Product.update(product, { where: { id_producto: id } });
};

// Eliminar producto
const deleteProduct = async (id) => {
    return Product.destroy({ where: { id_producto: id } });
};

// Cambiar estado del producto
const changeStateProduct = async (id, state) => {
    return Product.update({ estado: state }, { where: { id_producto: id } });
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getById,
    updateStock,
    updateProduct,
    deleteProduct,
    changeStateProduct,
};
