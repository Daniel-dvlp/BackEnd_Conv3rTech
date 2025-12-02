const sequelize = require('../../config/database'); // necesario para transacciones
const Quote = require('../../models/quotes/Quote');
const QuoteDetail = require('../../models/quotes/QuoteDetails');
const Client = require('../../models/clients/Clients');
const Product = require('../../models/products/Product');
const Service = require('../../models/services/Service');

// ✅ Crear cotización
const createQuote = async (quote) => {
    return Quote.create(quote);
};

// ✅ Obtener todas las cotizaciones
const getAllQuotes = async () => {
    return Quote.findAll({
        where: { convertida_a_proyecto: false },
        attributes: [
            'id_cotizacion',
            'nombre_cotizacion',
            'id_cliente',
            'fecha_creacion',
            'fecha_vencimiento',
            'subtotal_productos',
            'subtotal_servicios',
            'monto_iva',
            'monto_cotizacion',
            'observaciones',
            'motivo_anulacion',
            'estado'
        ],
        include: [
            { model: Client, as: 'cliente' },
            {
                model: QuoteDetail,
                as: 'detalles',
                include: [
                    { model: Product, as: 'producto' },
                    { model: Service, as: 'servicio' }
                ]
            }
        ]
    });
};

// ✅ Obtener cotización por ID
const getQuoteById = async (id) => {
    return Quote.findByPk(id, {
        attributes: [
            'id_cotizacion',
            'nombre_cotizacion',
            'id_cliente',
            'fecha_creacion',
            'fecha_vencimiento',
            'subtotal_productos',
            'subtotal_servicios',
            'monto_iva',
            'monto_cotizacion',
            'observaciones',
            'motivo_anulacion',
            'estado'
        ],
        include: [
            { association: 'cliente' },
            {
                association: 'detalles',
                include: [
                    { association: 'producto' },
                    { association: 'servicio' }
                ]
            }
        ]
    });
};

// ✅ Actualizar cotización
const updateQuote = async (id, quote, transaction = null) => {
    const options = { where: { id_cotizacion: id } };
    if (transaction) {
        options.transaction = transaction;
    }
    await Quote.update(quote, options);
    // Retorna la cotización actualizada con cliente y detalles
    return Quote.findByPk(id, {
        attributes: [
            'id_cotizacion',
            'nombre_cotizacion',
            'id_cliente',
            'fecha_creacion',
            'fecha_vencimiento',
            'subtotal_productos',
            'subtotal_servicios',
            'monto_iva',
            'monto_cotizacion',
            'observaciones',
            'motivo_anulacion',
            'estado'
        ],
        include: [
            { model: Client, as: 'cliente' },
            {
                model: QuoteDetail,
                as: 'detalles',
                include: [
                    { model: Product, as: 'producto' },
                    { model: Service, as: 'servicio' }
                ]
            }
        ]
    });
};

// ✅ Eliminar cotización (y sus detalles en cascada)
const deleteQuote = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        // Borrar primero los detalles
        await QuoteDetail.destroy({ where: { id_cotizacion: id }, transaction });

        // Luego borrar la cotización
        await Quote.destroy({ where: { id_cotizacion: id }, transaction });

        await transaction.commit();
        return { message: 'Cotización eliminada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ✅ Cambiar estado de la cotización
const changeQuoteState = async (id, state, motivoAnulacion = null, transaction = null) => {
    const updateData = { estado: state };
    if (motivoAnulacion) {
        updateData.motivo_anulacion = motivoAnulacion;
    }
    const options = { where: { id_cotizacion: id } };
    if (transaction) {
        options.transaction = transaction;
    }
    await Quote.update(updateData, options);
    // Retorna la cotización actualizada con cliente y detalles
    return Quote.findByPk(id, {
        attributes: [
            'id_cotizacion',
            'nombre_cotizacion',
            'id_cliente',
            'fecha_creacion',
            'fecha_vencimiento',
            'subtotal_productos',
            'subtotal_servicios',
            'monto_iva',
            'monto_cotizacion',
            'observaciones',
            'motivo_anulacion',
            'estado'
        ],
        include: [
            { model: Client, as: 'cliente' },
            {
                model: QuoteDetail,
                as: 'detalles',
                include: [
                    { model: Product, as: 'producto' },
                    { model: Service, as: 'servicio' }
                ]
            }
        ]
    });
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    changeQuoteState
};
