const ClientsRepositories = require('../../repositories/ClientsRepositories');
const AddressClientServices = require('./AddressClientServices'); 


// const createClient = async (clientData, addressClientData) => {
//     return ClientsRepositories.createClient(clientData);
// }

const createClient = async (clientData, addressClientData) => {
    try {
        // Paso 1: Primero creamos el cliente en la base de datos.
        // El repositorio de clientes solo se encarga de crear el cliente.
        const newClient = await ClientsRepositories.createClient(clientData);
        // Paso 2: Verificamos si hay direcciones para crear y asociar
        if (addressClientData && addressClientData.length > 0) {
            // Recorremos el arreglo de direcciones que llegó del frontend
            for (const address of addressClientData) {
                // Delegamos la creación de cada dirección al servicio de direcciones
                // y le pasamos el id_client del nuevo cliente para que la relacione
                const newAddress = await AddressClientServices.createAddressClient({
                    ...address,
                    id_client: newClient.id_cliente
                });
            }
        }

        // Paso 3: Retornamos el cliente recién creado
        return newClient;

    } catch (error) {
        // Manejamos cualquier error que pueda ocurrir durante el proceso
        console.error('Error al crear cliente con direcciones:', error);
        throw error;
    }

};
const getAllClients = async () => {
    return ClientsRepositories.getAllClients();
};

const updateClient = async (id, clientData , addressClientData) => {
    
    // Primero actualizamos el cliente
    const updatedClient = await ClientsRepositories.updateClient(id, clientData);
    
    // Luego actualizamos las direcciones asociadas al cliente
    if (addressClientData && addressClientData.length > 0) {
        for (const address of addressClientData) {
            await AddressClientServices.updateAddressClient(address.id_address, {
                ...address,
                id_client: id
            });
        }
    }

    return updatedClient;
};

const deleteClient = async (id, addressClientData) => {
    //Primero eliminamos el cliente
    const deleteClient =  await ClientsRepositories.deleteClient(id);
    //Luego eliminamos las direcciones asociadas al cliente
    if(addressClientData && addressClientData.length > 0){
        for(const address of addressClientData){
            await AddressClientServices.deleteAddressClient(address.id_address);
        }
    }
    return deleteClient;
}; 

const getClientById = async (id) => {
    return ClientsRepositories.getClientById(id);
};

module.exports = {
    createClient,   
    getAllClients,
    updateClient,
    deleteClient,
    getClientById
};