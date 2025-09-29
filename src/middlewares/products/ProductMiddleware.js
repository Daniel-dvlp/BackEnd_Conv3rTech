const { body, param } = require('express-validator');
const Product = require('../../models/products/Product');
const Category = require('../../models/products_category/ProductsCategory');

// Validar que el producto existe en BD
const validateProductExistence = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
        return Promise.reject('El producto no existe');
    }
};

// Validar que la categoría existe en BD
const validateCategoryExistence = async (id_categoria) => {
    const categoryId = parseInt(id_categoria);
    const category = await Category.findByPk(categoryId);
    if (!category) {
        return Promise.reject('La categoría no existe');
    }
};

// Validar que sea unico
const validateUniqueProduct = async (value, { req }) => {
    const { nombre, modelo, id_categoria, unidad_medida, codigo_barra } = req.body;

    // Construir la condición de búsqueda
    const whereCondition = { 
        nombre, 
        modelo, 
        id_categoria: parseInt(id_categoria), 
        unidad_medida 
    };

    // Solo incluir codigo_barra si no es null o vacío
    if (codigo_barra && codigo_barra.trim() !== '') {
        whereCondition.codigo_barra = codigo_barra;
    } else {
        whereCondition.codigo_barra = null;
    }

    const existing = await Product.findOne({
        where: whereCondition
    });

    if (existing) {
        return Promise.reject('Ya existe un producto con los mismos datos');
    }
};


// Validaciones base
const productBaseValidation = [
    body('nombre')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),
    body('modelo')
        .notEmpty()
        .withMessage('El modelo es obligatorio'),
    body('id_categoria')
        .isNumeric().withMessage('La categoría debe ser un número válido')
        .custom(validateCategoryExistence),
    body('unidad_medida')
        .isIn(['unidad', 'metros', 'tramo 2 metros', 'tramo 3 metros', 'paquetes', 'kit'])
        .withMessage('Unidad de medida inválida'),
    body('precio')
        .isNumeric().withMessage('El precio debe ser un número válido')
        .custom(value => parseFloat(value) >= 0).withMessage('El precio no puede ser negativo'),
    body('stock')
        .optional()
        .isNumeric().withMessage('El stock debe ser un número válido')
        .custom(value => parseInt(value) >= 0).withMessage('El stock debe ser mayor o igual a 0'),
    body('garantia')
        .isNumeric().withMessage('La garantía debe ser un número válido')
        .custom(value => parseInt(value) >= 12).withMessage('La garantía debe ser igual o mayor a 12 meses'),
    body('codigo_barra')
        .optional()
        .isString()
        .withMessage('El código de barras debe ser un texto'),
    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un booleano')
];

// Crear producto
const createProductValidation = [
    ...productBaseValidation,
    body('nombre').custom(validateUniqueProduct)
];

// Actualizar producto
const updateProductValidation = [
    body('nombre')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),
    body('modelo')
        .optional()
        .notEmpty()
        .withMessage('El modelo es obligatorio'),
    body('id_categoria')
        .optional()
        .isInt().withMessage('La categoría debe ser un número entero')
        .custom(validateCategoryExistence),
    body('unidad_medida')
        .optional()
        .isIn(['unidad', 'metros', 'tramo 2 metros', 'tramo 3 metros', 'paquetes', 'kit'])
        .withMessage('Unidad de medida inválida'),
    body('precio')
        .optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal válido')
        .custom(value => value >= 0).withMessage('El precio no puede ser negativo'),
    body('stock')
        .optional()
        .isNumeric().withMessage('El stock debe ser un número válido')
        .custom(value => parseInt(value) >= 0).withMessage('El stock debe ser mayor o igual a 0'),
    body('garantia')
        .optional()
        .isInt({ min: 12 })
        .withMessage('La garantía debe ser igual o mayor a 12 meses'),
    body('codigo_barra')
        .optional()
        .isString()
        .withMessage('El código de barras debe ser un texto'),
    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un booleano'),
    param('id')
        .isInt().withMessage('El id del producto debe ser un número entero')
        .custom(validateProductExistence)
];

// Eliminar producto
const deleteProductValidation = [
    param('id').isInt().withMessage('El id del producto debe ser un número entero'),
    param('id').custom(validateProductExistence)
];

// Obtener producto por id
const getProductByIdValidation = [
    param('id').isInt().withMessage('El id del producto debe ser un número entero'),
    param('id').custom(validateProductExistence)
];

// Cambiar estado
const changeProductStateValidation = [
    body('estado')
        .isBoolean()
        .withMessage('El estado debe ser un booleano'),
    param('id')
        .isInt().withMessage('El id del producto debe ser un número entero')
        .custom(validateProductExistence)
];

module.exports = {
    createProductValidation,
    updateProductValidation,
    deleteProductValidation,
    getProductByIdValidation,
    changeProductStateValidation
};
