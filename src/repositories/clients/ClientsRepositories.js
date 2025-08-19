const Client = require('../../models/clients/Clients');

const createClient = async (Client) => {
    return Client.create(Client);
}
const getAllClients = async () => {
    return Client.findAll();
}
const updateClient = async (id, ClientData) => {
    return Client.update(ClientData, { where: { id_cliente: id } });
}
const deleteClient = async (id) => {
    return Client.destroy({ where: { id_cliente: id } });
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