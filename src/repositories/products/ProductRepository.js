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
    // Asegurar que el precio no exceda el límite de DECIMAL(15, 2)
    if (product.precio) {
        // Eliminar puntos de miles si viene formateado como string (e.g. "150.000")
        // pero mantener el punto decimal si existe (e.g. "150000.50")
        let precioLimpio = product.precio;
        if (typeof product.precio === 'string') {
             // Si tiene puntos como separadores de miles, quitarlos
             if (product.precio.includes('.') && !product.precio.includes(',')) {
                 product.precio = product.precio.replace(/\./g, '');
             }
        }

        const precio = parseFloat(product.precio);
        // El valor máximo para DECIMAL(15, 2) es 9999999999999.99
        if (precio > 9999999999999.99) {
            throw new Error('El precio excede el límite permitido.');
        }
    }

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