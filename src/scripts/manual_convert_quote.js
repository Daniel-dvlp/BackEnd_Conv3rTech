
const ProjectService = require("../services/projects/ProjectService");
const Quote = require("../models/quotes/Quote");
const QuoteDetail = require("../models/quotes/QuoteDetails");
const Client = require("../models/clients/Clients");

async function run() {
    try {
        const quoteId = 3; // Using Quote 3
        console.log(`🔄 Converting Quote ${quoteId} to Project...`);

        // 1. Fetch Quote Details
        const quote = await Quote.findByPk(quoteId, {
            include: [
                { 
                    model: QuoteDetail, 
                    as: 'detalles' 
                },
                {
                    model: Client,
                    as: 'cliente'
                }
            ]
        });

        if (!quote) {
            console.error("❌ Quote not found");
            return;
        }

        console.log(`✅ Found Quote: ${quote.nombre_cotizacion}`);

        // 2. Separate materials and services
        const materiales = quote.detalles
            .filter(d => d.id_producto)
            .map(d => ({
                id_producto: d.id_producto,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario
            }));
        
        const servicios = quote.detalles
            .filter(d => d.id_servicio)
            .map(d => ({
                id_servicio: d.id_servicio,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario
            }));

        // 3. Construct Project Payload
        const fechaInicio = new Date();
        const fechaFin = quote.fecha_vencimiento 
            ? new Date(quote.fecha_vencimiento) 
            : new Date(fechaInicio);
        
        if (!quote.fecha_vencimiento) {
            fechaFin.setDate(fechaFin.getDate() + 30);
        }

        const projectPayload = {
            nombre: quote.nombre_cotizacion,
            id_cliente: quote.id_cliente,
            estado: 'Pendiente',
            fecha_inicio: fechaInicio.toISOString().split('T')[0],
            fecha_fin: fechaFin.toISOString().split('T')[0],
            prioridad: 'Alta',
            descripcion: `Proyecto generado desde cotización ${quote.nombre_cotizacion}. ${quote.observaciones || ''}`,
            observaciones: quote.observaciones || '',
            empleadosAsociados: [],
            materiales: materiales,
            servicios: servicios,
            costo_mano_obra: 0,
            sedes: [],
            id_cotizacion: quote.id_cotizacion
        };

        console.log("📦 Payload:", JSON.stringify(projectPayload, null, 2));

        // 4. Create Project
        const project = await ProjectService.createProject(projectPayload);
        console.log(`✅ Project Created: ID ${project.id_proyecto || project.id}`);

        // 5. Update Quote Status
        quote.estado = 'Aprobada';
        await quote.save();
        console.log("✅ Quote status updated to 'Aprobada'");

    } catch (error) {
        console.error("❌ Error:", error);
        if (error.errors) {
            error.errors.forEach(e => console.error(`   - ${e.message}`));
        }
    }
}

run();
