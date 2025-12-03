const sequelize = require('../config/database');
const Project = require('../models/projects/Project');
const Quote = require('../models/quotes/Quote');
const Client = require('../models/clients/Clients');
const Users = require('../models/users/Users');
const Role = require('../models/auth/Role');
const ProjectEmpleado = require('../models/projects/ProjectEmpleado');

async function createTestData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada.');

    // 1. Obtener o Crear Cliente
    const [client] = await Client.findOrCreate({
      where: { documento: '99999999' },
      defaults: {
        tipo_documento: 'CC',
        nombre: 'Cliente Prueba',
        apellido: 'Test',
        documento: '99999999',
        correo: 'cliente@test.com',
        telefono: '3001234567',
        estado_cliente: true
      }
    });
    console.log(`✅ Cliente ID: ${client.id_cliente}`);

    // 2. Obtener Usuario Técnico
    const role = await Role.findOne({ where: { nombre_rol: 'Tecnico' } });
    let technician;
    if (role) {
        technician = await Users.findOne({ where: { id_rol: role.id_rol } });
    }

    if (!technician && role) {
        console.log('⚠️ No se encontró un usuario con rol Técnico. Creando uno...');
        technician = await Users.create({
            nombre: 'Tecnico',
            apellido: 'Prueba',
            documento: '123456789',
            correo: 'tecnico@prueba.com',
            password: 'password123', // En un entorno real esto debería estar hasheado, pero para prueba rápida...
            telefono: '3000000000',
            id_rol: role.id_rol,
            estado_usuario: true
        });
        console.log(`✅ Usuario Técnico creado: ${technician.nombre} (ID: ${technician.id_usuario})`);
    } else if (!role) {
         console.log('❌ No se encontró el rol "Tecnico". Asegúrate de que los roles estén sembrados.');
    } else {
        console.log(`✅ Usuario Técnico encontrado: ${technician.nombre} (ID: ${technician.id_usuario})`);
    }
    
    // Obtener Admin para asignar proyectos restringidos
    const adminRole = await Role.findOne({ where: { nombre_rol: 'Administrador' } });
    const admin = await Users.findOne({ where: { id_rol: adminRole?.id_rol || 1 } });
    console.log(`✅ Usuario Admin encontrado: ${admin ? admin.nombre : 'N/A'} (ID: ${admin ? admin.id_usuario : 'N/A'})`);

    // 3. Crear Cotizaciones
    const quotesData = [
        { nombre_cotizacion: 'Cotización Prueba - Pendiente', monto_cotizacion: 1500000, estado: 'Pendiente', fecha_vencimiento: '2025-12-31' },
        { nombre_cotizacion: 'Cotización Prueba - Aprobada', monto_cotizacion: 2500000, estado: 'Aprobada', fecha_vencimiento: '2025-12-31' },
    ];

    for (const q of quotesData) {
        await Quote.create({
            ...q,
            id_cliente: client.id_cliente
        });
    }
    console.log('✅ Cotizaciones de prueba creadas.');

    // 4. Crear Proyectos
    if (technician) {
        // Proyecto donde el técnico es Responsable
        await Project.create({
            numero_contrato: `CTR-RESP-${Date.now()}`,
            nombre: 'Proyecto: Técnico Responsable',
            id_cliente: client.id_cliente,
            id_responsable: technician.id_usuario,
            fecha_inicio: '2025-01-10',
            fecha_fin: '2025-02-20',
            estado: 'En Progreso',
            prioridad: 'Alta',
            costo_mano_obra: 500000,
            costo_total_materiales: 200000,
            costo_total_servicios: 100000,
            costo_total_proyecto: 800000
        });
        console.log('✅ Proyecto creado (Técnico es Responsable).');
    }

    if (admin) {
        // Proyecto donde el Admin es Responsable (Técnico NO debería verlo)
        const projAdmin = await Project.create({
            numero_contrato: `CTR-ADMIN-${Date.now()}`,
            nombre: 'Proyecto: Solo Admin',
            id_cliente: client.id_cliente,
            id_responsable: admin.id_usuario,
            fecha_inicio: '2025-01-05',
            fecha_fin: '2025-03-01',
            estado: 'En Progreso',
            prioridad: 'Baja'
        });
        console.log('✅ Proyecto creado (Admin es Responsable - Restringido).');

        // Proyecto donde el Admin es Responsable pero Técnico está ASOCIADO
        if (technician) {
             const projAsoc = await Project.create({
                numero_contrato: `CTR-ASOC-${Date.now()}`,
                nombre: 'Proyecto: Técnico Asociado',
                id_cliente: client.id_cliente,
                id_responsable: admin.id_usuario,
                fecha_inicio: '2025-01-15',
                fecha_fin: '2025-02-15',
                estado: 'Pendiente',
                prioridad: 'Media'
            });
            
            await ProjectEmpleado.create({
                id_proyecto: projAsoc.id_proyecto,
                id_usuario: technician.id_usuario
            });
            console.log('✅ Proyecto creado (Técnico Asociado).');
        }
    }

    console.log('🎉 Datos de prueba creados exitosamente.');

  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
  } finally {
    await sequelize.close();
  }
}

createTestData();
