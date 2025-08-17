const {body, param} = require('express-validator');
const AddressClients = require('../../models/Clients/AddressClients');

// Validaciones para verificar la existencia de una direccion de cliente
const validateAddressClientsExistence = async(id) => {
    const addressClient = await AddressClients.findByPk(id);
    if (!addressClient) {
        throw new Error('Direccion de cliente no encontrada');
    }
}
// Validacion para verificar la unicidad de la direccion
const validateAddressClientsUniqueDireccion = async(address, { req }) => {
    const id = req.params.id;
    const where = { address };
    if (id) {
        where.id_address = { [require('sequelize').Op.ne]: id };
    }
    const addressClient = await AddressClients.findOne({ where });
    if (addressClient) {
        throw new Error('La direccion ya está en uso');
    }
}

const validateBaseAddressClients = [
    body('nameAddress')
        .notEmpty().withMessage('El nombre de la dirrecion es obligatoria')
        .isLength({ max: 20 }).withMessage('El nombre de la direccion no puede exceder los 20 caracteres'),
    body('address')
        .notEmpty().withMessage('La direccion es obligatoria')
        .isLength({ max: 255 }).withMessage('La direccion no puede exceder los 255 caracteres')
        .custom(validateAddressClientsUniqueDireccion),
    body('city')
        .notEmpty().withMessage('La ciudad es obligatoria')
        .isLength({ max: 50 }).withMessage('La ciudad no puede exceder los 50 caracteres'),
    body('id_client')
        .notEmpty().withMessage('El id del cliente es obligatorio')
        .isInt().withMessage('El id del cliente debe ser un número entero')

        //Vamos a comentar esta funcion mientras se hace testing
        // .custom(async (id_client) => {
        //     // CORRECCIÓN: Usa el modelo del Cliente para encontrar al cliente
        //     const client = await Client.findByPk(id_client);
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
    body('nameAddress')
        .optional()
        .isLength({ max: 20 }).withMessage('El nombre de la direccion no puede exceder los 20 caracteres'),
    body('address')
        .optional()
        .isLength({ max: 255 }).withMessage('La direccion no puede exceder los 255 caracteres')
        .custom(validateAddressClientsUniqueDireccion),
    body('city')
        .optional()
        .isLength({ max: 50 }).withMessage('La ciudad no puede exceder los 50 caracteres'),
    body('id_client')
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