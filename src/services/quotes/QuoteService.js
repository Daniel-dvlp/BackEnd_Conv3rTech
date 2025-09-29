const sequelize = require('../../config/database');
const QuoteRepository = require('../../repositories/quotes/QuoteRepository');
const QuoteDetail = require('../../models/quotes/QuoteDetails');
const ProductRepository = require('../../repositories/products/ProductRepository');
const ServiceRepository = require('../../repositories/services/ServiceRepository');
const ProjectService = require('../../services/projects/ProjectService');
const Project = require('../../models/projects/Project');
const Users = require('../../models/users/Users');

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
    const updatedQuote = await QuoteRepository.changeQuoteState(id, state);

    // Si se aprueba la cotización, crear proyecto automáticamente (1-1)
    if (state === 'Aprobada') {
        // Evitar duplicados: si ya existe proyecto para esta cotización, no crear de nuevo
        const existingProject = await Project.findOne({ where: { id_cotizacion: id } });
        if (!existingProject) {
            // Fecha de inicio en zona horaria local (YYYY-MM-DD)
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const todayLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

            // El responsable se asignará manualmente al modificar el proyecto
            const projectData = {
                numero_contrato: undefined, // se genera en ProjectService si falta
                nombre: updatedQuote.nombre_cotizacion,
                id_cliente: updatedQuote.id_cliente,
                // No incluir id_responsable para que use el valor por defecto de la BD
                fecha_inicio: updatedQuote.fecha_creacion,
                fecha_fin: updatedQuote.fecha_vencimiento,
                estado: 'Pendiente',
                prioridad: 'Media',
                ubicacion: undefined,
                descripcion: undefined,
                observaciones: updatedQuote.observaciones || undefined,
                costo_mano_obra: 0,
                costo_total_materiales: parseFloat(updatedQuote.subtotal_productos || 0),
                costo_total_servicios: parseFloat(updatedQuote.subtotal_servicios || 0),
                costo_total_proyecto: parseFloat(updatedQuote.monto_cotizacion || 0),
                id_cotizacion: updatedQuote.id_cotizacion,
                materiales: [],
                servicios: [],
                empleadosAsociados: [],
                sedes: []
            };

            await ProjectService.createProject(projectData);
        }
    }

    return updatedQuote;
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    changeQuoteState
};
