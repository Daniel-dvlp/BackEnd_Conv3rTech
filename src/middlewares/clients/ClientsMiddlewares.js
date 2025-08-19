const {body, param} = require('express-validator');
const Clients = require('../../models/clients/Clients');

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
    
]