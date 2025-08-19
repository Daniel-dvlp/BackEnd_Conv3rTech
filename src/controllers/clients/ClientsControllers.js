const  {validationResult} = require('express-validator');
const ClientsServices = require('../../services/clients/ClientsServices');
const Clients = require('../../models/clients/Clients');

const createClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const client = await ClientsServices.createClient(req.body);
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getAllClients = async (req, res) => {
    try {
        const clients = await ClientsServices.getAllClients();
        res.status(200).json(clients);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const [updated] = await Clients.update(req.body, { where: { id_client: id } });
        if (updated) {
            const updatedClient = await Clients.findOne({ where: { id_client: id } });
            return res.status(200).json(updatedClient);
        }
        return res.status(404).json({ error: 'Cliente no encontrado' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}   
const deleteClient = async (req, res) => {
    try {
        const client = await ClientsServices.deleteClient(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await ClientsServices.getClientById(id);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = {
    createClient,
    getAllClients,
    updateClient,
    deleteClient,
    getClientById
};