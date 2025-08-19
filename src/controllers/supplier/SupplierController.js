const { validationResult } = require("express-validator");
const supplierService = require('../../services/supplier/SupplierService');

const createSupplier = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const supplier = await supplierService.createSupplier(req.body);
        res.status(200).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierService.getAllSuppliers();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getSupplierById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const supplier = await supplierService.getSupplierById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateSupplier = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [updated] = await supplierService.updateSupplier(req.params.id, req.body);
        if (updated) {
            const updatedSupplier = await supplierService.getSupplierById(req.params.id);
            return res.status(200).json(updatedSupplier);
        }
        return res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const deleted = await supplierService.deleteSupplier(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const changeStateSupplier = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [updated] = await supplierService.changeStateSupplier(req.params.id, req.body.estado);
        if (!updated) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    changeStateSupplier,
};
