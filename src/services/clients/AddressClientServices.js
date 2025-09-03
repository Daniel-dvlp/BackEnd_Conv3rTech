const AddressClientsRepositories = require('../../repositories/clients/AddressClientsRepositories');

const createAddressClient = async (addressClientData) => {
    return AddressClientsRepositories.createAddressClient(addressClientData);
}

const getAllAddressClients = async () => {
    return AddressClientsRepositories.getAllAddressClients();
}
const updateAddressClient = async (id, addressClientData) => {
    return AddressClientsRepositories.updateAddressClient(id, addressClientData);
}
const deleteAddressClient = async (id) => {
    return AddressClientsRepositories.deleteAddressClient(id);
}
module.exports = {
    createAddressClient,
    getAllAddressClients,
    updateAddressClient,
    deleteAddressClient
};