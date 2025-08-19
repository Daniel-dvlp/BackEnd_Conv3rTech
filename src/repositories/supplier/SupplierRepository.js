const Supplier = require('../../models/supplier/SupplierModel');

const createSupplier = async (supplierData) => {
    return Supplier.create(supplierData);
};

const getAllSuppliers = async () => {
    return Supplier.findAll();
};

const getSupplierById = async (id) => {
    return Supplier.findByPk(id);
};

const updateSupplier = async (id, supplierData) => {
    const [updated] = await Supplier.update(supplierData, {
        where: { id_proveedor: id }
    });
    return [updated];
};

const deleteSupplier = async (id) => {
    return Supplier.destroy({
        where: { id_proveedor: id }
    });
};

const changeStateSupplier = async (id, estado) => {
    const [updated] = await Supplier.update({ estado }, {
        where: { id_proveedor: id }
    });
    return [updated];
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    changeStateSupplier,
};
