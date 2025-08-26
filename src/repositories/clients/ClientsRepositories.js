const Client = require('../../models/clients/Clients');
const { Op } = require('sequelize');

const createClient = async (clientData) => {
    return Client.create(clientData);
}
const getAllClients = async () => {
    return Client.findAll();
}
const updateClient = async (id, ClientData) => {
    return Client.update(ClientData, { where: { id_client: id } });
}
const deleteClient = async (id) => {
    return Client.destroy({ where: { id_client: id } });
}
const getClientById = async (id) => {
    return Client.findByPk(id);
}
const changeClientStatus = async (id, status) => {
    const result = await Client.update({ stateClient: status }, { where: { id_client: id } });
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
            { document: { [likeOperator]: `%${searchTerm}%` } },
            { type_document: { [likeOperator]: `%${searchTerm}%` } },
            { name: { [likeOperator]: `%${searchTerm}%` } },
            { lastName: { [likeOperator]: `%${searchTerm}%` } },
            { phone: { [likeOperator]: `%${searchTerm}%` } },
            { email: { [likeOperator]: `%${searchTerm}%` } }
        ];

        // Agregar búsqueda por ID si el término es un número
        const parsedId = Number(searchTerm);
        if (!Number.isNaN(parsedId)) {
            orConditions.push({ id_client: parsedId });
        }

        // Agregar búsqueda por estado si el término es un booleano válido
        if (searchTerm.toLowerCase() === 'true' || searchTerm.toLowerCase() === 'false') {
            const boolValue = searchTerm.toLowerCase() === 'true';
            orConditions.push({ stateClient: boolValue });
        }

        // Agregar búsqueda por crédito si el término es un booleano válido
        if (searchTerm.toLowerCase() === 'true' || searchTerm.toLowerCase() === 'false') {
            const boolValue = searchTerm.toLowerCase() === 'true';
            orConditions.push({ credit: boolValue });
        }

        console.log('Buscando clientes con término:', searchTerm);
        console.log('Condiciones de búsqueda:', JSON.stringify(orConditions, null, 2));

        const results = await Client.findAll({ 
            where: { [Op.or]: orConditions },
            order: [['name', 'ASC']] // Ordenar por nombre
        });

        console.log(`Se encontraron ${results.length} clientes`);
        return results;

    } catch (error) {
        console.error('Error en searchClients:', error);
        throw error;
    }
}
const changeClientCredit = async (id, credit) => {
    const result = await Client.update({ credit: credit }, { where: { id_client: id } });
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