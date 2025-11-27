const SaleRepository = require('../../repositories/products_sale/SaleRepository');
const ProductRepository = require('../../repositories/products/ProductRepository');
const sequelize = require('../../config/database');
const SaleDetail = require('../../models/products_sale/SaleDetails');
const Sale = require('../../models/products_sale/Sale');
const Product = require('../../models/products/Product');

// Crear venta
const createSale = async (sale) => {
    console.log('Datos recibidos en createSale:', JSON.stringify(sale, null, 2));

    const transaction = await sequelize.transaction();

    try {
        // Verificar que sale.detalles existe y es un array
        if (!sale.detalles || !Array.isArray(sale.detalles) || sale.detalles.length === 0) {
            throw new Error('Debe incluir al menos un detalle de venta');
        }

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
                throw new Error(`Stock insuficiente para el producto ${product.nombre}. Disponible: ${product.stock}, solicitado: ${detail.cantidad}`);
            }

            const precioUnitario = parseFloat(product.precio);
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

            // Restar stock - CORRECCIÓN: pasar transaction directamente
            const newStock = product.stock - detail.cantidad;
            await ProductRepository.updateStock(product.id_producto, newStock, transaction);
        }

        // Calcular totales de la venta
        const montoIva = subtotalVenta * iva;
        const montoVenta = subtotalVenta + montoIva;

        // Generar número de venta si no se proporciona
        let numeroVenta = sale.numero_venta;
        if (!numeroVenta) {
            const currentYear = new Date().getFullYear();
            
            // Contar ventas del año actual
            const countThisYear = await Sale.count({
                where: sequelize.where(
                    sequelize.fn('YEAR', sequelize.col('fecha_registro')),
                    currentYear
                ),
                transaction
            });
            
            const sequence = (countThisYear + 1).toString().padStart(3, '0');
            numeroVenta = `VT-${currentYear}-${sequence}`;
        }

        // Crear venta principal
        const newSale = await SaleRepository.createSale({
            numero_venta: numeroVenta,
            id_cliente: sale.id_cliente,
            fecha_venta: sale.fecha_venta,
            metodo_pago: sale.metodo_pago,
            estado: sale.estado || 'Registrada',
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

        // Retornar venta completa con relaciones
        return await SaleRepository.getSaleById(newSale.id_venta);
    } catch (error) {
        await transaction.rollback();
        console.error('Error en createSale:', error);
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

// Cambiar estado de la venta (ejemplo: Anular) y manejar inventario
const changeSaleState = async (id, state, motivoAnulacion = null) => {
    const transaction = await sequelize.transaction();

    try {
        const sale = await Sale.findByPk(id, {
            include: [{ model: SaleDetail, as: 'detalles' }],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!sale) {
            throw new Error('Venta no encontrada');
        }

        const previousState = sale.estado;

        // Solo devolver stock si pasa de un estado distinto a "Anulada" hacia "Anulada"
        if (state === 'Anulada' && previousState !== 'Anulada') {
            for (const detail of sale.detalles || []) {
                const product = await Product.findByPk(detail.id_producto, {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });

                if (!product) {
                    throw new Error(`Producto con ID ${detail.id_producto} no encontrado`);
                }

                const newStock = Number(product.stock || 0) + Number(detail.cantidad || 0);
                await ProductRepository.updateStock(product.id_producto, newStock, transaction);
            }
        }

        const updateData = { estado: state };
        if (state === 'Registrada') {
            updateData.motivo_anulacion = null;
        } else if (state === 'Anulada') {
            updateData.motivo_anulacion = motivoAnulacion || null;
        } else if (motivoAnulacion !== null) {
            updateData.motivo_anulacion = motivoAnulacion;
        }

        await Sale.update(updateData, { where: { id_venta: id }, transaction });

        await transaction.commit();
        return SaleRepository.getSaleById(id);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    changeSaleState
};