const sequelize = require('../../config/database');
const QuoteRepository = require('../../repositories/quotes/QuoteRepository');
const QuoteDetail = require('../../models/quotes/QuoteDetails');
const ProductRepository = require('../../repositories/products/ProductRepository');
const ServiceRepository = require('../../repositories/services/ServiceRepository');

// ✅ Crear cotización (con sus detalles)
const createQuote = async (quote) => {
    const transaction = await sequelize.transaction();

    try {
        let subtotalProductos = 0;
        let subtotalServicios = 0;
        const iva = 0.19;

        const detallesCalculados = [];

        for (const detail of quote.detalles) {
            if (detail.id_producto) {
                // Producto
                const product = await ProductRepository.getById(detail.id_producto);

                if (!product) {
                    throw new Error(`Producto con ID ${detail.id_producto} no encontrado`);
                }

                const precioUnitario = product.precio;
                const subtotal = detail.cantidad * precioUnitario;

                subtotalProductos += subtotal;

                detallesCalculados.push({
                    id_producto: detail.id_producto,
                    cantidad: detail.cantidad,
                    precio_unitario: precioUnitario,
                    subtotal
                });
            } else if (detail.id_servicio) {
                // Servicio
                const service = await ServiceRepository.findById(detail.id_servicio);

                if (!service) {
                    throw new Error(`Servicio con ID ${detail.id_servicio} no encontrado`);
                }

                const precioUnitario = service.precio;
                const subtotal = detail.cantidad * precioUnitario;

                subtotalServicios += subtotal;

                detallesCalculados.push({
                    id_servicio: detail.id_servicio,
                    cantidad: detail.cantidad,
                    precio_unitario: precioUnitario,
                    subtotal
                });
            }
        }

        // Totales de la cotización
        const subtotalGeneral = subtotalProductos + subtotalServicios;
        const montoIva = subtotalGeneral * iva;
        const montoCotizacion = subtotalGeneral + montoIva;

        // Crear cotización principal
        const newQuote = await QuoteRepository.createQuote({
            ...quote,
            subtotal_productos: subtotalProductos,
            subtotal_servicios: subtotalServicios,
            monto_iva: montoIva,
            monto_cotizacion: montoCotizacion
        }, { transaction });

        // Insertar detalles
        for (const det of detallesCalculados) {
            await QuoteDetail.create(
                { ...det, id_cotizacion: newQuote.id_cotizacion },
                { transaction }
            );
        }

        await transaction.commit();
        return newQuote;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ✅ Obtener todas las cotizaciones
const getAllQuotes = async () => {
    return QuoteRepository.getAllQuotes();
};

// ✅ Obtener cotización por ID
const getQuoteById = async (id) => {
    return QuoteRepository.getQuoteById(id);
};

// ✅ Actualizar cotización
const updateQuote = async (id, quote) => {
    return QuoteRepository.updateQuote(id, quote);
};

// ✅ Eliminar cotización
const deleteQuote = async (id) => {
    return QuoteRepository.deleteQuote(id);
};

// ✅ Cambiar estado de la cotización
const changeQuoteState = async (id, state) => {
    return QuoteRepository.changeQuoteState(id, state);
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    changeQuoteState
};
