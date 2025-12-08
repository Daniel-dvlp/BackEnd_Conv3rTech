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
    // 1. Validar si hay stock
    const product = await ProductRepository.getProductById(id);
    if (!product) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }
    
    if (product.stock > 0) {
        const error = new Error(`No se puede eliminar el producto porque tiene stock disponible (${product.stock} unidades).`);
        error.statusCode = 400;
        throw error;
    }

    // 2. Validar si está en proyectos activos (ejemplo conceptual, requiere repositorio de proyectos)
    const ProjectMaterial = require('../../models/projects/ProjectMaterial');
    const SedeMaterial = require('../../models/projects/SedeMaterial');
    const SalidaMaterial = require('../../models/projects/SalidaMaterial');

    const inProject = await ProjectMaterial.findOne({ where: { id_producto: id } });
    if (inProject) {
        const error = new Error("No se puede eliminar el producto porque está asignado a un proyecto.");
        error.statusCode = 400;
        throw error;
    }

    const inSede = await SedeMaterial.findOne({ where: { id_producto: id } });
    if (inSede) {
        const error = new Error("No se puede eliminar el producto porque está asignado a una sede de proyecto.");
        error.statusCode = 400;
        throw error;
    }

    const inSalida = await SalidaMaterial.findOne({ where: { id_producto: id } });
    if (inSalida) {
        const error = new Error("No se puede eliminar el producto porque tiene historial de salidas de material.");
        error.statusCode = 400;
        throw error;
    }

    // 3. Validar si está en cotizaciones
    const QuoteDetail = require('../../models/quotes/QuoteDetails');
    const inQuote = await QuoteDetail.findOne({ where: { id_producto: id } });
    if (inQuote) {
        const error = new Error("No se puede eliminar el producto porque está incluido en una cotización.");
        error.statusCode = 400;
        throw error;
    }

    // 4. Validar si está en compras
    const PurchaseDetail = require('../../models/purchase/PurchaseDetailModel');
    const inPurchase = await PurchaseDetail.findOne({ where: { id_producto: id } });
    if (inPurchase) {
        const error = new Error("No se puede eliminar el producto porque tiene historial de compras.");
        error.statusCode = 400;
        throw error;
    }
    
    // 5. Validar si está en ventas
    const SaleDetail = require('../../models/products_sale/SaleDetails');
    const inSale = await SaleDetail.findOne({ where: { id_producto: id } });
    if (inSale) {
        const error = new Error("No se puede eliminar el producto porque tiene historial de ventas.");
        error.statusCode = 400;
        throw error;
    }

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
