const  {validationResult} = require('express-validator');
const AddressClientsServices = require('../../services/clients/AddressClientservices');
const AddressClients = require('../../models/clients/AddressClients');

const createAddressClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const addressClient = await AddressClientsServices.createAddressClient(req.body);
        res.status(200).json(addressClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllAddressClients = async (req, res) => {
    try {
        const addressClients = await AddressClientsServices.getAllAddressClients();
        res.status(200).json(addressClients);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateAddressClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const [updated] = await AddressClients.update(req.body, { where: { id_address: id } });
        if (updated) {
            const updatedAddressClient = await AddressClients.findOne({ where: { id_address: id } });
            return res.status(200).json(updatedAddressClient);
        }
        return res.status(404).json({ error: 'Direccion de cliente no encontrada' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteAddressClient = async (req, res) => {
    try {
        const addressClient = await AddressClientsServices.deleteAddressClient(req.params.id);
        if (!addressClient) {
            return res.status(404).json({ error: 'Direccion de cliente no encontrada' });
        }
        res.status(200).json({ message: 'Direccion de cliente eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createAddressClient,
    getAllAddressClients,
    updateAddressClient,
    deleteAddressClient
};