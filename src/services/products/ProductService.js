const ProductRepository = require('../../repositories/products/ProductRepository');

// Crear producto
const createProduct = async (product) => {
    return ProductRepository.createProduct(product);
};

// Obtener todos los productos (con categoría y fichas técnicas)
const getAllProducts = async () => {
    return ProductRepository.getAllProducts();
};

// Obtener producto por ID
const getProductById = async (id) => {
    return ProductRepository.getProductById(id);
};

// Actualizar producto
const updateProduct = async (id, product) => {
    return ProductRepository.updateProduct(id, product);
};

// Eliminar producto
const deleteProduct = async (id) => {
    return ProductRepository.deleteProduct(id);
};

// Cambiar estado del producto
const changeStateProduct = async (id, state) => {
    return ProductRepository.changeStateProduct(id, state);
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    changeStateProduct
};
