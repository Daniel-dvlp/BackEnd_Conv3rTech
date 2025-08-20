const {body, param} = require('express-validator');
const Clients = require('../../models/clients/Clients');

// Normaliza el body para aceptar tanto payload anidado { client, addresses }
// como plano { document, type_document, ... , addresses }
const normalizeClientPayload = (req, _res, next) => {
    const hasNestedClient = req.body && typeof req.body.client === 'object' && req.body.client !== null;
    if (hasNestedClient) {
        const { client, addresses, ...rest } = req.body;
        req.body = { ...rest, ...client, addresses };
    }
    next();
}

// Validaciones para verificar la existencia de un cliente
const validateClientsExistence = async(id) => {
    const client = await Clients.findByPk(id);
    if (!client) {
        throw new Error('Cliente no encontrado');
    }
}

// Validacion para verificar la unicidad del cliente
const validateClientsUniqueDocument = async(document, { req }) => {
    const id = req.params.id;
    const where = { document };
    if (id) {
        where.id_client = { [require('sequelize').Op.ne]: id };
    }
    const client = await Clients.findOne({ where });
    if (client) {
        throw new Error('El documento ya está en uso');
    }
}
const validateBaseClients = [
    body('document')
        .notEmpty().withMessage('El documento es obligatorio')
        .isLength({ max: 20 }).withMessage('El documento no puede exceder los 20 caracteres')
        .custom(validateClientsUniqueDocument),
    body('type_document')
        .notEmpty().withMessage('El tipo de Documento es Obligatorio')
        .isIn(['CC', 'CE', 'PPT', 'NIT','PA']),
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
    body('lastName')
        .optional()
        .isLength({ max: 50}).withMessage('El apellido no puede exceder los 50 caracteres')
    ,
    body('phone')
        .isLength({ max: 15 }).withMessage('El teléfono no puede exceder los 15 caracteres'),
    body('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('credit')
        .isBoolean().withMessage('El credito debe ser un booleano'),
    body('stateClient')
        .isBoolean().withMessage('El estado del cliente debe ser un booleano')

]

const validateCreateClients = [
    ...validateBaseClients
]

const validateUpdateClients = [
    param('id'),
    body('document')
    .optional()
    .notEmpty().withMessage('El documento es obligatorio')
    .isLength({ max: 20 }).withMessage('El documento no puede exceder los 20 caracteres')
    .custom(validateClientsUniqueDocument),
body('type_document')
    .optional()
    .notEmpty().withMessage('El tipo de Documento es Obligatorio')
    .isIn(['CC', 'CE', 'PPT', 'NIT','PA']),
body('name')
    .optional()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
body('lastName')
    .optional()
    .isLength({ max: 50}).withMessage('El apellido no puede exceder los 50 caracteres')
,
body('phone')
    .optional()
    .isLength({ max: 15 }).withMessage('El teléfono no puede exceder los 15 caracteres'),
body('email')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido'),
body('credit')
    .optional()
    .isBoolean().withMessage('El credito debe ser un booleano'),
body('stateClient')
    .optional()
    .isBoolean().withMessage('El estado del cliente debe ser un booleano')
]

const validateDeleteClients = [
    param('id')
    .notEmpty().withMessage('El id del cliente es obligatorio')
    .isInt().withMessage('El id del cliente debe ser un número entero')
]

module.exports = {
    normalizeClientPayload,
    validateCreateClients,
    validateUpdateClients,
    validateDeleteClients
};