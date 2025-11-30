const sequelize = require('../../config/database');
const QuoteRepository = require('../../repositories/quotes/QuoteRepository');
const QuoteDetail = require('../../models/quotes/QuoteDetails');
const Product = require('../../models/products/Product');
const ProductRepository = require('../../repositories/products/ProductRepository');
const ServiceRepository = require('../../repositories/services/ServiceRepository');
const ProjectService = require('../../services/projects/ProjectService');
const MailService = require('../../services/common/MailService');
const Project = require('../../models/projects/Project');
const Quote = require('../../models/quotes/Quote');
const Users = require('../../models/users/Users');
const ACCEPTED_STATES = ['Aprobada', 'Aceptada'];

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

// ✅ Obtener todas las cotizaciones (Excluye las que ya son proyectos/aprobadas)
const getAllQuotes = async () => {
    const quotes = await QuoteRepository.getAllQuotes();
    // Filtrar las cotizaciones que NO estén en estados aceptados
    return quotes.filter(q => !ACCEPTED_STATES.includes(q.estado));
};

// ✅ Obtener cotización por ID
const getQuoteById = async (id) => {
    return QuoteRepository.getQuoteById(id);
};

// ✅ Actualizar cotización
const updateQuote = async (id, quote) => {
    const transaction = await sequelize.transaction();

    try {
        // Si hay detalles en la actualización, actualizarlos también
        if (quote.detalles && Array.isArray(quote.detalles)) {
            let subtotalProductos = 0;
            let subtotalServicios = 0;
            const iva = 0.19;

            // Eliminar todos los detalles existentes
            await QuoteDetail.destroy({ where: { id_cotizacion: id }, transaction });

            const detallesCalculados = [];

            // Calcular nuevos detalles
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

            // Insertar nuevos detalles
            for (const det of detallesCalculados) {
                await QuoteDetail.create(
                    { ...det, id_cotizacion: id },
                    { transaction }
                );
            }

            // Calcular y actualizar totales
            const subtotalGeneral = subtotalProductos + subtotalServicios;
            const montoIva = subtotalGeneral * iva;
            const montoCotizacion = subtotalGeneral + montoIva;

            // Actualizar cotización con totales
            const quoteData = {
                ...quote,
                subtotal_productos: subtotalProductos,
                subtotal_servicios: subtotalServicios,
                monto_iva: montoIva,
                monto_cotizacion: montoCotizacion
            };
            delete quoteData.detalles; // Eliminar detalles del objeto principal antes de actualizar

            await QuoteRepository.updateQuote(id, quoteData, transaction);
        } else {
            // Si no hay detalles, solo actualizar campos base
            await QuoteRepository.updateQuote(id, quote, transaction);
        }

        await transaction.commit();
        // Retornar cotización actualizada
        return QuoteRepository.getQuoteById(id);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ✅ Eliminar cotización
const deleteQuote = async (id) => {
    return QuoteRepository.deleteQuote(id);
};

// ✅ Cambiar estado de la cotización
const changeQuoteState = async (id, state, motivoAnulacion = null) => {
    const transaction = await sequelize.transaction();
    console.log(`[QuoteService] Changing state for quote ${id} to '${state}'`);

    try {
        const currentQuote = await Quote.findByPk(id, {
            include: [
                {
                    model: QuoteDetail,
                    as: 'detalles',
                    include: [{ model: Product, as: 'producto' }]
                }
            ],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!currentQuote) {
            console.error(`[QuoteService] Quote ${id} not found`);
            throw new Error('Cotización no encontrada');
        }

        console.error(`[QuoteService] Current state: '${currentQuote.estado}'`);

        const wasAccepted = ACCEPTED_STATES.includes(currentQuote.estado);
        const willBeAccepted = ACCEPTED_STATES.includes(state);

        console.error(`[QuoteService] wasAccepted: ${wasAccepted}, willBeAccepted: ${willBeAccepted}`);

        const updatedQuote = await QuoteRepository.changeQuoteState(id, state, motivoAnulacion, transaction);

        // Verificar si ya existe proyecto (para manejar casos de re-aprobación o migración)
        const existingProject = await Project.findOne({ where: { id_cotizacion: id }, transaction });
        
        // Condición mejorada:
        // 1. Si pasa de NO aceptado a ACEPTADO.
        // 2. O si ya estaba aceptado pero NO tiene proyecto (caso de cotizaciones antiguas aprobadas sin lógica de proyecto/stock).
        const shouldProcessApproval = willBeAccepted && (!wasAccepted || !existingProject);

        console.error(`[QuoteService] Existing project found: ${!!existingProject}`);
        console.error(`[QuoteService] Should process approval logic (project/stock): ${shouldProcessApproval}`);

        // Crear proyecto y descontar inventario solo si se cumple la condición
        if (shouldProcessApproval) {
            console.error('[QuoteService] Transitioning to accepted state (or fixing inconsistencies). Initiating project creation and stock deduction.');
            
            // Evitar duplicados: verificar de nuevo (aunque ya lo tenemos en existingProject, la lógica original lo tenía aquí)
            if (!existingProject) {
                console.error('[QuoteService] Creating new project...');
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
                    // Inicializar arrays vacíos explícitamente para evitar errores en validaciones
                    materiales: [],
                    servicios: [],
                    empleadosAsociados: [],
                    sedes: []
                };

                const createdProject = await ProjectService.createProject(projectData, transaction);
                console.error(`[QuoteService] Project created with ID: ${createdProject.id}`);

                try {
                    const recipients = await Users.findAll({ where: { id_rol: [1, 3] }, attributes: ['correo', 'nombre'] });
                    for (const r of recipients) {
                        const subject = `Proyecto pendiente de asignación: ${createdProject.nombre}`;
                        const text = `Se creó el proyecto '${createdProject.nombre}' desde una cotización aprobada. Asigne responsable y equipo de trabajo.`;
                        await MailService.sendGenericEmail({ to: r.correo, subject, text });
                    }
                } catch (e) {
                    console.error('[QuoteService] Error sending email:', e);
                }
            } else {
                console.error('[QuoteService] Project already exists, skipping creation.');
            }

            console.error('[QuoteService] Starting stock deduction...');
            for (const detail of currentQuote.detalles || []) {
                console.error(`[QuoteService] Processing detail: product ID ${detail.id_producto}, quantity ${detail.cantidad}`);
                if (detail.id_producto && detail.cantidad > 0) {
                    const product = detail.producto;
                    if (!product) {
                        console.error(`[QuoteService] Product with ID ${detail.id_producto} not found in detail`);
                        throw new Error(`Producto con ID ${detail.id_producto} no encontrado`);
                    }
                    
                    const currentStock = Number(product.stock || 0);
                    const quantityToDeduct = Number(detail.cantidad || 0);
                    const newStock = currentStock - quantityToDeduct;
                    
                    console.error(`[QuoteService] Product: ${product.nombre}, Current Stock: ${currentStock}, Deducting: ${quantityToDeduct}, New Stock: ${newStock}`);

                    if (newStock < 0) {
                        throw new Error(`Stock insuficiente para el producto ${product.nombre}. Stock disponible: ${product.stock}, requerido: ${detail.cantidad}`);
                    }
                    await ProductRepository.updateStock(detail.id_producto, newStock, transaction);
                    console.error(`[QuoteService] Stock updated for product ${detail.id_producto}`);
                } else {
                    console.error('[QuoteService] Skipping detail (not a product or quantity <= 0)');
                }
            }
        } else {
            console.error('[QuoteService] State change does not require stock deduction (already accepted with project, or not becoming accepted).');
        }

        await transaction.commit();
        console.log('[QuoteService] Transaction committed successfully');
        return updatedQuote;
    } catch (error) {
        console.error('[QuoteService] Error in changeQuoteState:', error);
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    changeQuoteState
};
