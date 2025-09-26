const SaleRepository = require('../../repositories/products_sale/SaleRepository');
const ProductRepository = require('../../repositories/products/ProductRepository');
const sequelize = require('../../config/database'); // necesario para transacciones
const SaleDetail = require('../../models/products_sale/SaleDetails');
const Sale = require('../../models/products_sale/Sale');

// Crear venta 
const createSale = async (sale) => {
    const transaction = await sequelize.transaction();

    try {
        let subtotalVenta = 0;
        const iva = 0.19;

        // Primero calculamos subtotales por producto
        const detallesCalculados = [];
        for (const detail of sale.detalles) {
            const product = await ProductRepository.getById(detail.id_producto);

            if (!product) {
                throw new Error(`Producto con ID ${detail.id_producto} no encontrado`);
            }

            // Verificar stock
            if (product.stock < detail.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${product.nombre}`);
            }

            const precioUnitario = product.precio;
            const subtotalProducto = detail.cantidad * precioUnitario;

            // Acumular subtotal general
            subtotalVenta += subtotalProducto;

            // Armar detalle listo para insertar
            detallesCalculados.push({
                id_producto: detail.id_producto,
                cantidad: detail.cantidad,
                precio_unitario: precioUnitario,
                subtotal_producto: subtotalProducto
            });

            // Restar stock
            const newStock = product.stock - detail.cantidad;
            await ProductRepository.updateStock(product.id_producto, newStock, { transaction });
        }

        // Calcular totales de la venta
        const montoIva = subtotalVenta * iva;
        const montoVenta = subtotalVenta + montoIva;

        // Generar número de venta si no se proporciona
        let numeroVenta = sale.numero_venta;
        if (!numeroVenta) {
            const currentYear = new Date().getFullYear();
            // Compatible con MySQL/MariaDB: YEAR(fecha_registro) = currentYear
            const countThisYear = await Sale.count({
                where: sequelize.where(
                    sequelize.fn('YEAR', sequelize.col('fecha_registro')),
                    currentYear
                )
            });
            const sequence = (countThisYear + 1).toString().padStart(3, '0');
            numeroVenta = `VT-${currentYear}-${sequence}`;
        }

        // Crear venta principal
        const newSale = await SaleRepository.createSale({
            ...sale,
            numero_venta: numeroVenta,
            subtotal_venta: subtotalVenta,
            monto_iva: montoIva,
            monto_venta: montoVenta
        }, { transaction });

        // Insertar detalles de la venta
        for (const det of detallesCalculados) {
            await SaleDetail.create(
                { ...det, id_venta: newSale.id_venta },
                { transaction }
            );
        }

        // Confirmar transacción
        await transaction.commit();

        return newSale;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Obtener todas las ventas (con cliente y detalles)
const getAllSales = async () => {
    return SaleRepository.getAllSales();
};

// Obtener venta por ID (con cliente y detalles)
const getSaleById = async (id) => {
    return SaleRepository.getSaleById(id);
};

// Actualizar venta
const updateSale = async (id, sale) => {
    return SaleRepository.updateSale(id, sale);
};

// Eliminar venta
const deleteSale = async (id) => {
    return SaleRepository.deleteSale(id);
};

// Cambiar estado de la venta (ejemplo: Anular)
const changeSaleState = async (id, state) => {
    return SaleRepository.changeSaleState(id, state);
};

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    changeSaleState
};
