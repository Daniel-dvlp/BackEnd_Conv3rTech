const  {validationResult} = require('express-validator');
const ClientsServices = require('../../services/clients/ClientsServices');
const Clients = require('../../models/clients/Clients');

const createClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Tras la normalización, los campos del cliente están en el nivel raíz
        const { addresses, ...clientData } = req.body;
        const createdClient = await ClientsServices.createClient(clientData, addresses);
        res.status(201).json(createdClient);
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
        const { addresses, ...clientData } = req.body;
        await ClientsServices.updateClient(id, clientData, addresses);
        const updatedClient = await Clients.findOne({ where: { id_client: id } });
        if (!updatedClient) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        return res.status(200).json(updatedClient);
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