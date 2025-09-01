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
        const updatedClient = await Clients.findOne({ where: { id_cliente: id } });
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

const changeClientStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_cliente } = req.body;
        
        // Validar que el campo estado_cliente esté presente
        if (estado_cliente === undefined) {
            return res.status(400).json({ error: 'El campo estado_cliente es requerido' });
        }
        
        // Actualizar el estado del cliente
        const [updatedRows] = await ClientsServices.changeClientStatus(id, estado_cliente);
        
        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado o no se pudo actualizar' });
        }
        
        // Obtener el cliente actualizado para confirmar el cambio
        const updatedClient = await Clients.findOne({ where: { id_cliente: id } });
        
        res.status(200).json({ 
            message: 'Estado del cliente actualizado exitosamente',
            client: updatedClient
        });
    } catch (error) {
        console.error('Error al cambiar estado del cliente:', error);
        res.status(500).json({ error: error.message });
    }
}

const searchClients = async (req, res) => {
    try {
        const { term } = req.params;
        console.log('Buscando clientes con término:', term);
        
        if (!term) {
            return res.status(400).json({ error: 'Término de búsqueda requerido' });
        }
        
        const clients = await ClientsServices.searchClients(term);
        console.log(`Búsqueda completada. Se encontraron ${clients.length} clientes`);
        
        res.status(200).json({
            message: `Búsqueda completada`,
            term: term,
            count: clients.length,
            results: clients
        });
    } catch (error) {
        console.error('Error en searchClients controller:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
}

const changeClientCredit = async (req, res) => {
    try {
        const { id } = req.params;
        const { credito } = req.body;
        
        // Validar que el campo credito esté presente
        if (credito === undefined) {
            return res.status(400).json({ error: 'El campo credito es requerido' });
        }
        
        // Actualizar el crédito del cliente
        const [updatedRows] = await ClientsServices.changeClientCredit(id, credito);
        
        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado o no se pudo actualizar' });
        }
        
        // Obtener el cliente actualizado para confirmar el cambio
        const updatedClient = await Clients.findOne({ where: { id_cliente: id } });
        
        res.status(200).json({ 
            message: 'Crédito del cliente actualizado exitosamente',
            client: updatedClient
        });
    } catch (error) {
        console.error('Error al cambiar crédito del cliente:', error);
        res.status(500).json({ error: error.message });
    }
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