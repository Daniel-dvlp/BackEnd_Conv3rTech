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
                    { model: Feature, as: 'caracteristica' }
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

// Actualizar stock del producto - CORRECCIÓN
const updateStock = async (id, newStock, transaction = null) => {
    const options = { 
        where: { id_producto: id }
    };
    
    // Si se pasa una transacción, agregarla a las opciones
    if (transaction) {
        options.transaction = transaction;
    }
    
    return Product.update(
        { stock: newStock },
        options
    );
};

// Actualizar producto
const updateProduct = async (id, product) => {
    await Product.update(product, { where: { id_producto: id } });
    return Product.findByPk(id, {
        include: [
            { model: Category, as: 'categoria' },
            {
                model: Datasheet,
                as: 'fichas_tecnicas',
                include: [
                    { model: Feature, as: 'caracteristica' }
                ]
            }
        ]
    });
};

// Eliminar producto
const deleteProduct = async (id) => {
    return Product.destroy({ where: { id_producto: id } });
};

// Cambiar estado del producto
const changeStateProduct = async (id, state) => {
    await Product.update({ estado: state }, { where: { id_producto: id } });
    return Product.findByPk(id, {
        include: [
            { model: Category, as: 'categoria' },
            {
                model: Datasheet,
                as: 'fichas_tecnicas',
                include: [
                    { model: Feature, as: 'caracteristica' }
                ]
            }
        ]
    });
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