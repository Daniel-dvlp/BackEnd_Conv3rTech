const { validationResult } = require("express-validator");
const purchaseService = require('../../services/purchase/PurchaseService');

const createPurchase = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const purchase = await purchaseService.createPurchase(req.body);
        res.status(200).json(purchase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllPurchases = async (req, res) => {
    try {
        const purchases = await purchaseService.getAllPurchases();
        res.status(200).json(purchases);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPurchaseById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const purchase = await purchaseService.getPurchaseById(req.params.id);
        res.status(200).json(purchase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePurchase = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [updated] = await purchaseService.updatePurchase(req.params.id, req.body);
        if (updated) {
            const updatedPurchase = await purchaseService.getPurchaseById(req.params.id);
            return res.status(200).json(updatedPurchase);
        }
        return res.status(404).json({ error: 'Compra no encontrada' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deletePurchase = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const deleted = await purchaseService.deletePurchase(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const changeStatePurchase = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await purchaseService.changeStatePurchase(req.params.id, req.body.estado);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
    changeStatePurchase,
};
