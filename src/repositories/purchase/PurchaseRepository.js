const Purchase = require('../../models/purchase/PurchaseModel');
const PurchaseDetail = require('../../models/purchase/PurchaseDetailModel');
const Supplier = require('../../models/supplier/SupplierModel');
const Product = require('../../models/products/Product');
const { Sequelize } = require('sequelize');

const createPurchase = async (purchaseData) => {
    const t = await Purchase.sequelize.transaction();
    try {
        const { detalles_compras, ...purchaseInfo } = purchaseData;
        
        const purchase = await Purchase.create(purchaseInfo, { transaction: t });

        const detailsToCreate = detalles_compras.map(detail => ({
            ...detail,
            id_compra: purchase.id_compra,
            subtotal_producto: detail.cantidad * detail.precio_unitario,
        }));

        for (const detail of detalles_compras) {
            const product = await Product.findByPk(detail.id_producto, { transaction: t });

            if (!product) {
                throw new Error(`Producto con ID ${detail.id_producto} no encontrado.`);
            }

            await product.increment('stock', { by: detail.cantidad, transaction: t });
        }
        
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
            {
                model: Supplier, 
                as: 'supplier'
            },
            {
                model: PurchaseDetail, 
                as: 'purchaseDetails',
                include: [
                    {
                        model: Product, 
                        as: 'product'
                    }
                ]
            }
        ]
    });
};

const getPurchaseById = async (id) => {
    return Purchase.findByPk(id, {
        include: [
            {
                model: Supplier,
                as: 'supplier'
            },
            {
                model: PurchaseDetail,
                as: 'purchaseDetails',
                include: [
                    {
                        model: Product,
                        as: 'product'
                    }
                ]
            }
        ]
    });
};

// Asegúrate de exportar todas las funciones que necesitas
module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    // Aquí puedes agregar las funciones que faltan como updatePurchase y deletePurchase
};