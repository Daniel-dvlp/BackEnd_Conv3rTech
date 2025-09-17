const { validationResult } = require('express-validator');
const productService = require('../../services/products/ProductService')
const datasheetService = require('../../services/products/DatasheetService');

const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // 1. Crear el producto
        const product = await productService.createProduct(req.body);

        // 2. Crear fichas técnicas si vienen en el request
        if (req.body.fichas_tecnicas && req.body.fichas_tecnicas.length > 0) {
            for (const ficha of req.body.fichas_tecnicas) {
                await datasheetService.createDatasheet({
                    id_producto: product.id_producto,
                    id_caracteristica: ficha.id_caracteristica,
                    valor: ficha.valor
                });
            }
        }

        // 3. Consultar el producto con sus fichas técnicas
        const productWithDetails = await productService.getProductById(product.id_producto);

        res.status(201).json({
            message: 'Producto y ficha(s) técnica(s) creados exitosamente',
            data: productWithDetails
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        if (products.length === 0) {
            return res.status(200).json({ message: 'No hay productos registrados', data: [] });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar producto
const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ message: 'Producto actualizado exitosamente', data: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await productService.deleteProduct(req.params.id);
        res.status(201).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cambiar estado de producto
const changeStateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedProduct = await productService.changeStateProduct(req.params.id, req.body.estado);
        res.status(200).json({ message: 'Estado del producto actualizado exitosamente', data: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    changeStateProduct
};
