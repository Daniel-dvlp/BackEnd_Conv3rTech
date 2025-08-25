const Client = require('../../models/clients/Clients');

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

module.exports = {
    createClient,
    getAllClients,
    updateClient,
    deleteClient,
    getClientById
};