const supplierRepository = require('../../repositories/supplier/SupplierRepository');

const createSupplier = async (supplierData) => {
    return supplierRepository.createSupplier(supplierData);
};

const getAllSuppliers = async () => {
    return supplierRepository.getAllSuppliers();
};

const getSupplierById = async (id) => {
    return supplierRepository.getSupplierById(id);
};

const updateSupplier = async (id, supplierData) => {
    return supplierRepository.updateSupplier(id, supplierData);
};

const deleteSupplier = async (id) => {
    return supplierRepository.deleteSupplier(id);
};

const changeStateSupplier = async (id, estado) => {
    return supplierRepository.changeStateSupplier(id, estado);
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    changeStateSupplier,
};
