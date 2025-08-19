const purchaseRepository = require('../../repositories/purchase/PurchaseRepository');
const PurchaseModel = require('../../models/purchase/PurchaseModel');
const PurchaseDetailModel = require('../../models/purchase/PurchaseDetailModel');

const createPurchase = async (purchaseData) => {
    return purchaseRepository.createPurchase(purchaseData);
};

const getAllPurchases = async () => {
    return purchaseRepository.getAllPurchases();
};

const getPurchaseById = async (id) => {
    return purchaseRepository.getPurchaseById(id);
};

const updatePurchase = async (id, purchaseData) => {
    return purchaseRepository.updatePurchase(id, purchaseData);
};

const deletePurchase = async (id) => {
    return purchaseRepository.deletePurchase(id);
};

const changeStatePurchase = async (id, estado) => {
    return purchaseRepository.changeStatePurchase(id, estado);
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
    changeStatePurchase,
};
