const AddressClients= require('../../models/clients/AddressClients');

const createAddressClient = async (addressClient) => {
    return AddressClients.create(addressClient);
}
const getAllAddressClients = async () => {
    return AddressClients.findAll();
}
const updateAddressClient = async (id, addressClientData) => {
    return AddressClients.update(addressClientData, { where: { id } });
}
const deleteAddressClient = async (id) => {
    return AddressClients.destroy({ where: {id_address: id } });
}

module.exports = {
    createAddressClient,
    getAllAddressClients,
    updateAddressClient,
    deleteAddressClient
};