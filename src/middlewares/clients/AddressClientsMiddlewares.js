const {body, param} = require('express-validator');
const AddressClients = require('../../models/clients/AddressClients');

// Validaciones para verificar la existencia de una direccion de cliente
const validateAddressClientsExistence = async(id) => {
    const addressClient = await AddressClients.findByPk(id);
    if (!addressClient) {
        throw new Error('Direccion de cliente no encontrada');
    }
}

// Validacion para verificar la unicidad de la direccion
const validateAddressClientsUniqueDireccion = async(direccion, { req }) => {
    const id = req.params.id;
    const where = { direccion };
    if (id) {
        where.id_direccion = { [require('sequelize').Op.ne]: id };
    }
    const addressClient = await AddressClients.findOne({ where });
    if (addressClient) {
        throw new Error('La direccion ya está en uso');
    }
}

const validateBaseAddressClients = [
    body('nombre_direccion')
        .notEmpty().withMessage('El nombre de la direccion es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre de la direccion no puede exceder los 100 caracteres'),
    body('direccion')
        .notEmpty().withMessage('La direccion es obligatoria')
        .isLength({ max: 255 }).withMessage('La direccion no puede exceder los 255 caracteres')
        .custom(validateAddressClientsUniqueDireccion),
    body('ciudad')
        .notEmpty().withMessage('La ciudad es obligatoria')
        .isLength({ max: 100 }).withMessage('La ciudad no puede exceder los 100 caracteres'),
    body('id_cliente')
        .notEmpty().withMessage('El id del cliente es obligatorio')
        .isInt().withMessage('El id del cliente debe ser un número entero')

        //Vamos a comentar esta funcion mientras se hace testing
        // .custom(async (id_cliente) => {
        //     // CORRECCIÓN: Usa el modelo del Cliente para encontrar al cliente
        //     const client = await Client.findByPk(id_cliente);
        //     if (!client) {
        //         throw new Error('Cliente no encontrado');
        //     }
        // }),
];

// validaciones para crear una direccion de cliente
const validateCreateAddressClients = [
    ...validateBaseAddressClients,
];

// validaciones para actualizar una direccion de cliente
const validateUpdateAddressClients = [
    param('id'),
    body('nombre_direccion')
        .optional()
        .isLength({ max: 100 }).withMessage('El nombre de la direccion no puede exceder los 100 caracteres'),
    body('direccion')
        .optional()
        .isLength({ max: 255 }).withMessage('La direccion no puede exceder los 255 caracteres')
        .custom(validateAddressClientsUniqueDireccion),
    body('ciudad')
        .optional()
        .isLength({ max: 100 }).withMessage('La ciudad no puede exceder los 100 caracteres'),
    body('id_cliente')
        .optional()
        .isInt().withMessage('El id del cliente debe ser un número entero')
];

// validaciones para eliminar una direccion de cliente
const validateDeleteAddressClients = [
    param('id')
        .notEmpty().withMessage('El id de la direccion es obligatorio')
        .isInt().withMessage('El id de la direccion debe ser un número entero')
        .custom(validateAddressClientsExistence),
];

module.exports = {
    validateCreateAddressClients,
    validateUpdateAddressClients,
    validateDeleteAddressClients
};