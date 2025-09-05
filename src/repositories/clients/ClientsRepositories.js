const Client = require('../../models/clients/Clients');
const { Op } = require('sequelize');
const AddressClients = require('../../models/clients/AddressClients');

const createClient = async (clientData) => {
    return Client.create(clientData);
}

const getAllClients = async () => {
    return Client.findAll(
        { include: [{ model: AddressClients, as: 'AddressClients' }] }
    );
}

const updateClient = async (id, ClientData) => {
    return Client.update(ClientData, { where: { id_cliente: id } });
}

const deleteClient = async (id) => {
    return Client.destroy({ where: { id_cliente: id } });
}

const getClientById = async (id) => {
    
    return Client.findByPk(id, { include: [{ model: AddressClients, as: 'AddressClients' }] });
}

const changeClientStatus = async (id, status) => {
    const result = await Client.update({ estado_cliente: status }, { where: { id_cliente: id } });
    return result;
}

const searchClients = async (term) => {
    try {
        const searchTerm = (term || '').trim();
        
        // Si no hay término de búsqueda, retornar todos los clientes
        if (searchTerm.length === 0) {
            return Client.findAll();
        }

        // Determinar el operador LIKE según el dialecto de la base de datos
        const likeOperator = Client.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

        // Condiciones de búsqueda para campos de texto
        const orConditions = [
            { documento: { [likeOperator]: `%${searchTerm}%` } },
            { tipo_documento: { [likeOperator]: `%${searchTerm}%` } },
            { nombre: { [likeOperator]: `%${searchTerm}%` } },
            { apellido: { [likeOperator]: `%${searchTerm}%` } },
            { telefono: { [likeOperator]: `%${searchTerm}%` } },
            { correo: { [likeOperator]: `%${searchTerm}%` } }
        ];

        // Agregar búsqueda por ID si el término es un número
        const parsedId = Number(searchTerm);
        if (!Number.isNaN(parsedId)) {
            orConditions.push({ id_cliente: parsedId });
        }

        // Agregar búsqueda por estado si el término es un booleano válido
        if (searchTerm.toLowerCase() === 'true' || searchTerm.toLowerCase() === 'false') {
            const boolValue = searchTerm.toLowerCase() === 'true';
            orConditions.push({ estado_cliente: boolValue });
        }

        // Agregar búsqueda por crédito si el término es un booleano válido
        if (searchTerm.toLowerCase() === 'true' || searchTerm.toLowerCase() === 'false') {
            const boolValue = searchTerm.toLowerCase() === 'true';
            orConditions.push({ credito: boolValue });
        }

        console.log('Buscando clientes con término:', searchTerm);
        console.log('Condiciones de búsqueda:', JSON.stringify(orConditions, null, 2));

        const results = await Client.findAll({ 
            where: { [Op.or]: orConditions },
            order: [['nombre', 'ASC']] // Ordenar por nombre
        });

        console.log(`Se encontraron ${results.length} clientes`);
        return results;

    } catch (error) {
        console.error('Error en searchClients:', error);
        throw error;
    }
}

const changeClientCredit = async (id, credit) => {
    const result = await Client.update({ credito: credit }, { where: { id_cliente: id } });
    return result;
}

module.exports = {
    createClient,
    getAllClients,
    updateClient,
    deleteClient,
    getClientById,
    changeClientStatus,
    searchClients,
    changeClientCredit
};