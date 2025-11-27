const { validationResult } = require('express-validator');
const productService = require('../../services/products/ProductService');
const datasheetService = require('../../services/products/DatasheetService');
const { deleteImage, extractPublicId } = require('../../config/cloudinary');

const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errores de validación:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        console.log('Datos recibidos para crear producto:', req.body);
        
        // Obtener URLs de las imágenes subidas (si existen)
        const fotos = req.files ? req.files.map(file => file.path) : [];
        
        // 1. Crear el producto con las fotos
        const productData = {
            ...req.body,
            fotos: fotos.length > 0 ? fotos : (req.body.fotos || [])
        };
        
        const product = await productService.createProduct(productData);
        console.log('Producto creado:', product);

        // 2. Crear fichas técnicas si vienen en el request
        if (req.body.fichas_tecnicas) {
            let fichasTecnicas = req.body.fichas_tecnicas;
            
            // Si viene como string, parsearlo
            if (typeof fichasTecnicas === 'string') {
                try {
                    fichasTecnicas = JSON.parse(fichasTecnicas);
                } catch (e) {
                    console.error('Error al parsear fichas_tecnicas:', e);
                    fichasTecnicas = [];
                }
            }
            
            if (Array.isArray(fichasTecnicas) && fichasTecnicas.length > 0) {
                console.log('Creando fichas técnicas:', fichasTecnicas);
                for (const ficha of fichasTecnicas) {
                    await datasheetService.createDatasheet({
                        id_producto: product.id_producto,
                        id_caracteristica: ficha.id_caracteristica,
                        valor: ficha.valor
                    });
                }
            }
        }

        // 3. Consultar el producto con sus fichas técnicas
        const productWithDetails = await productService.getProductById(product.id_producto);

        res.status(201).json({
            message: 'Producto y ficha(s) técnica(s) creados exitosamente',
            data: productWithDetails
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        
        // Si hay imágenes subidas y falla la creación, eliminarlas de Cloudinary
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const publicId = extractPublicId(file.path);
                    if (publicId) {
                        await deleteImage(publicId);
                    }
                } catch (deleteError) {
                    console.error('Error al eliminar imagen:', deleteError);
                }
            }
        }
        
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
        // Obtener el producto actual para comparar fotos
        const currentProduct = await productService.getProductById(req.params.id);
        
        // Obtener URLs de nuevas imágenes subidas (si existen)
        const newFotos = req.files ? req.files.map(file => file.path) : [];
        
        // Obtener fotos existentes del body
        let existingFotos = [];
        if (req.body.fotos) {
            existingFotos = typeof req.body.fotos === 'string' 
                ? JSON.parse(req.body.fotos) 
                : req.body.fotos;
        }
        
        // Combinar fotos existentes con nuevas
        const allFotos = [...existingFotos, ...newFotos];
        
        // Identificar fotos eliminadas
        const fotosEliminadas = currentProduct.fotos?.filter(
            foto => !allFotos.includes(foto)
        ) || [];
        
        // Eliminar fotos de Cloudinary
        for (const foto of fotosEliminadas) {
            try {
                const publicId = extractPublicId(foto);
                if (publicId) {
                    await deleteImage(publicId);
                    console.log('Imagen eliminada de Cloudinary:', publicId);
                }
            } catch (deleteError) {
                console.error('Error al eliminar imagen:', deleteError);
            }
        }
        
        // Actualizar el producto
        const productData = {
            ...req.body,
            fotos: allFotos
        };
        
        const updatedProduct = await productService.updateProduct(req.params.id, productData);
        
        res.status(200).json({ 
            message: 'Producto actualizado exitosamente', 
            data: updatedProduct 
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
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
        // Obtener el producto para acceder a sus fotos
        const product = await productService.getProductById(req.params.id);
        
        // Eliminar fotos de Cloudinary
        if (product.fotos && Array.isArray(product.fotos)) {
            for (const foto of product.fotos) {
                try {
                    const publicId = extractPublicId(foto);
                    if (publicId) {
                        await deleteImage(publicId);
                        console.log('Imagen eliminada de Cloudinary:', publicId);
                    }
                } catch (deleteError) {
                    console.error('Error al eliminar imagen:', deleteError);
                }
            }
        }
        
        // Eliminar el producto
        await productService.deleteProduct(req.params.id);
        
        res.status(201).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
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