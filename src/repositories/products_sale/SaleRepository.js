const sequelize = require('../../config/database'); // necesario para transacciones
const Sale = require('../../models/products_sale/Sale');
const Client = require('../../models/clients/Clients');
const SaleDetail = require('../../models/products_sale/SaleDetails');
const Product = require('../../models/products/Product');

// ✅ Crear venta
const createSale = async (sale, options = {}) => {
    const createdSale = await Sale.create(sale, options);
    // Retornar como instancia de Sequelize (no convertir aquí para mantener la transacción)
    return createdSale;
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
    try {
        const sale = await Sale.findByPk(id, {
            include: [
                { model: Client, as: 'cliente', required: false },
                {
                    model: SaleDetail,
                    as: 'detalles',
                    required: false,
                    include: [{ model: Product, as: 'producto', required: false }]
                }
            ],
            raw: false // Mantener instancias de Sequelize para poder usar get()
        });
        
        // Convertir a objeto plano para evitar problemas de serialización
        if (!sale) {
            return null;
        }
        
        // Usar toJSON() que es más seguro que get({ plain: true })
        if (typeof sale.toJSON === 'function') {
            return sale.toJSON();
        } else if (typeof sale.get === 'function') {
            return sale.get({ plain: true });
        } else {
            // Si ya es un objeto plano, retornarlo directamente
            return sale;
        }
    } catch (error) {
        console.error('Error en getSaleById:', error);
        throw error;
    }
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
