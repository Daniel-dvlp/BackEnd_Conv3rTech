const Purchase = require('../../models/purchase/PurchaseModel');
const PurchaseDetail = require('../../models/purchase/PurchaseDetailModel');
const { Sequelize } = require('sequelize');

const createPurchase = async (purchaseData) => {
    const t = await Purchase.sequelize.transaction();
    try {
        const { detalles_compras, ...purchaseInfo } = purchaseData;
        
        const detailsWithSubtotal = detalles_compras.map(detail => ({
            ...detail,
            subtotal_producto: detail.cantidad * detail.precio_unitario,
        }));

        const purchase = await Purchase.create(purchaseInfo, { transaction: t });

        const detailsToCreate = detailsWithSubtotal.map(detail => ({
            ...detail,
            id_compra: purchase.id_compra
        }));

        await PurchaseDetail.bulkCreate(detailsToCreate, { transaction: t });

        await t.commit();
        return purchase;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const getAllPurchases = async () => {
    return Purchase.findAll({
        include: [
            { model: PurchaseDetail }
        ]
    });
};

const getPurchaseById = async (id) => {
    return Purchase.findByPk(id, {
        include: [
            { model: PurchaseDetail }
        ]
    });
};

const updatePurchase = async (id, purchaseData) => {
    const t = await Purchase.sequelize.transaction();
    try {
        const { detalles_compras, ...purchaseInfo } = purchaseData;

        if (detalles_compras) {
            await PurchaseDetail.destroy({ where: { id_compra: id }, transaction: t });

            const detailsWithSubtotal = detalles_compras.map(detail => ({
                ...detail,
                subtotal_producto: detail.cantidad * detail.precio_unitario,
                id_compra: id
            }));
            await PurchaseDetail.bulkCreate(detailsWithSubtotal, { transaction: t });
        }
        
        const [updated] = await Purchase.update(purchaseInfo, { where: { id_compra: id }, transaction: t });

        await t.commit();
        return [updated];
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const deletePurchase = async (id) => {
    return Purchase.destroy({ where: { id_compra: id } });
};

const changeStatePurchase = async (id, estado) => {
    return Purchase.update({ estado }, { where: { id_compra: id } });
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
    changeStatePurchase,
};
