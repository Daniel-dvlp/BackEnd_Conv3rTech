const sequelize = require('../../config/database'); // necesario para transacciones
const Sale = require('../../models/products_sale/Sale');
const Client = require('../../models/clients/Clients');
const SaleDetail = require('../../models/products_sale/SaleDetails');
const Product = require('../../models/products/Product');

// ✅ Crear venta
const createSale = async (sale, options = {}) => {
    return Sale.create(sale, options);
};

// ✅ Obtener todas las ventas
const getAllSales = async () => {
    return Sale.findAll({
        include: [
            { model: Client, as: 'cliente' },
            {
                model: SaleDetail,
                as: 'detalles',
                include: [{ model: Product, as: 'producto' }]
            }
        ]
    });
};

// ✅ Obtener venta por ID
const getSaleById = async (id) => {
    return Sale.findByPk(id, {
        include: [
            { model: Client, as: 'cliente' },
            {
                model: SaleDetail,
                as: 'detalles',
                include: [{ model: Product, as: 'producto' }]
            }
        ]
    });
};

// ✅ Actualizar venta
const updateSale = async (id, sale) => {
    await Sale.update(sale, { where: { id_venta: id } });
    // Retorna la venta actualizada con cliente y detalles
    return Sale.findByPk(id, {
        include: [
            { model: Client, as: 'cliente' },
            {
                model: SaleDetail,
                as: 'detalles',
                include: [{ model: Product, as: 'producto' }]
            }
        ]
    });
};

// ✅ Eliminar venta
const deleteSale = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        // Borrar primero los detalles
        await SaleDetail.destroy({ where: { id_venta: id }, transaction });

        // Luego borrar la venta
        await Sale.destroy({ where: { id_venta: id }, transaction });

        await transaction.commit();
        return { message: 'Venta eliminada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ✅ Cambiar estado de la venta (ej: Registrada ⇆ Anulada)
const changeSaleState = async (id, state) => {
    await Sale.update({ estado: state }, { where: { id_venta: id } });
    // Retorna la venta actualizada con cliente y detalles
    return Sale.findByPk(id, {
        include: [
            { model: Client, as: 'cliente' },
            {
                model: SaleDetail,
                as: 'detalles',
                include: [{ model: Product, as: 'producto' }]
            }
        ]
    });
};

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    changeSaleState
};
