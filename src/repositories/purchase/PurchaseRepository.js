const Purchase = require('../../models/purchase/PurchaseModel');
const PurchaseDetail = require('../../models/purchase/PurchaseDetailModel');
const Supplier = require('../../models/supplier/SupplierModel');
const Product = require('../../models/products/Product');
const { Sequelize } = require('sequelize');

const createPurchase = async (purchaseData) => {
    const t = await Purchase.sequelize.transaction();
    try {
        const { detalles_compras, ...purchaseInfo } = purchaseData;

        // Validar consistencia de montos
        const calculatedSubtotal = detalles_compras.reduce((sum, d) => sum + (Number(d.cantidad) * Number(d.precio_unitario)), 0);
        const inputIva = Number(purchaseInfo.iva) || 0;
        const expectedTotal = calculatedSubtotal + inputIva;
        const inputMonto = Number(purchaseInfo.monto);

        // Permitir una pequeña diferencia por redondeo (e.g., 0.50)
        if (Math.abs(expectedTotal - inputMonto) > 0.5) {
            throw new Error(`El monto total (${inputMonto}) no coincide con la suma de los detalles (${calculatedSubtotal}) + IVA (${inputIva}). Diferencia: ${Math.abs(expectedTotal - inputMonto)}`);
        }
        
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

const changeStatePurchase = async (id, estado, motivo) => {
    const t = await Purchase.sequelize.transaction();
    try {
        const purchase = await Purchase.findByPk(id, {
            include: [{ model: PurchaseDetail, as: 'purchaseDetails' }],
            transaction: t
        });

        if (!purchase) {
            throw new Error('Compra no encontrada');
        }

        // Si se anula la compra, revertir el stock (restar lo que se sumó)
        if (estado === 'Anulada' && purchase.estado !== 'Anulada') {
            for (const detail of purchase.purchaseDetails) {
                const product = await Product.findByPk(detail.id_producto, { transaction: t });
                if (product) {
                    await product.decrement('stock', { by: detail.cantidad, transaction: t });
                }
            }
        }
        // Si se reactiva una compra anulada (Anulada -> Registrada/Completada), sumar el stock nuevamente
        else if (purchase.estado === 'Anulada' && estado !== 'Anulada') {
            for (const detail of purchase.purchaseDetails) {
                const product = await Product.findByPk(detail.id_producto, { transaction: t });
                if (product) {
                    await product.increment('stock', { by: detail.cantidad, transaction: t });
                }
            }
        }

        let nuevasObservaciones = purchase.observaciones || '';
        if (estado === 'Anulada' && motivo) {
            const nota = `MOTIVO: "${motivo}"`;
            nuevasObservaciones = nuevasObservaciones
                ? `${nuevasObservaciones}\n${nota}`
                : nota;
        }

        const updatedPurchase = await purchase.update(
            { estado, observaciones: nuevasObservaciones },
            { transaction: t }
        );
        
        await t.commit();
        return [1]; // Retornar formato compatible con update
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// Asegúrate de exportar todas las funciones que necesitas
module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    changeStatePurchase,
    // Aquí puedes agregar las funciones que faltan como updatePurchase y deletePurchase
};