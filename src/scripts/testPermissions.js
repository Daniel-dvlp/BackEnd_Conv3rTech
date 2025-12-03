const sequelize = require('../config/database');
const projectController = require('../controllers/projects/ProjectController');
const ProgramacionesController = require('../controllers/labor_scheduling/ProgramacionesController');
const Users = require('../models/users/Users');
const Role = require('../models/auth/Role');

// Instanciar controladores (si son clases)
// const projectController = new ProjectController();

async function testPermissions() {
    try {
        sequelize.options.logging = false; // Disable SQL logging for cleaner output
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada.');

        // 1. Obtener Usuario Técnico creado por createTestData.js
        const role = await Role.findOne({ where: { nombre_rol: 'Tecnico' } });
        if (!role) throw new Error('Rol Técnico no encontrado. Corre createTestData.js primero.');

        const technician = await Users.findOne({ where: { id_rol: role.id_rol } });
        if (!technician) throw new Error('Usuario Técnico no encontrado. Corre createTestData.js primero.');

        console.log(`👤 Probando con usuario: ${technician.nombre} (ID: ${technician.id_usuario}, Rol ID: ${technician.id_rol})`);

        // --- MOCK RESPONSE OBJECT ---
        const mockRes = {
            statusCode: 200,
            jsonData: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.jsonData = data;
                return this;
            }
        };

        // --- TEST 1: PROYECTOS (Técnico) ---
        console.log('\n🧪 [TEST 1] Consultando Proyectos como Técnico...');
        
        const reqTech = {
            user: {
                id_usuario: technician.id_usuario,
                id_rol: technician.id_rol,
                rol: 'Tecnico'
            },
            query: {}
        };

        // Reset mockRes
        mockRes.jsonData = null;
        
        await projectController.getAllProjects(reqTech, mockRes);

        if (mockRes.jsonData && mockRes.jsonData.success) {
            const projects = mockRes.jsonData.data;
            console.log(`📊 Proyectos encontrados: ${projects.length}`);
            
            let pass = true;
            projects.forEach((p, index) => {
                if (index === 0) console.log('🔍 Debug Project Structure:', JSON.stringify(p, null, 2));

                const isResponsible = p.responsable && p.responsable.id === technician.id_usuario;
                const isAssociated = p.empleadosAsociados && p.empleadosAsociados.some(e => e.id === technician.id_usuario);
                
                console.log(`   - Proyecto: "${p.nombre}" (Responsable ID: ${p.responsable?.id}, Asociado: ${isAssociated})`);
                
                if (!isResponsible && !isAssociated) {
                    console.error(`   ❌ ERROR: El técnico ve un proyecto donde NO es responsable NI asociado.`);
                    pass = false;
                }
            });

            if (pass && projects.length > 0) {
                console.log('✅ PRUEBA DE PROYECTOS EXITOSA: Solo ve sus proyectos.');
            } else if (projects.length === 0) {
                console.warn('⚠️ ADVERTENCIA: No se encontraron proyectos. Asegúrate de haber corrido createTestData.js.');
            } else {
                console.error('❌ PRUEBA DE PROYECTOS FALLIDA.');
            }

        } else {
            console.error('❌ Error al obtener proyectos:', mockRes.jsonData);
        }


        // --- TEST 2: PROGRAMACIÓN LABORAL (Técnico) ---
        console.log('\n🧪 [TEST 2] Consultando Programación como Técnico...');
        
        // Reset mockRes
        mockRes.jsonData = null;

        // ProgramacionesController.list espera (req, res, next)
        const next = (err) => console.error('❌ Error en controller:', err);

        await ProgramacionesController.list(reqTech, mockRes, next);

        if (mockRes.jsonData && mockRes.jsonData.success) {
            const programaciones = mockRes.jsonData.data;
            console.log(`📅 Programaciones encontradas: ${programaciones.length}`);
             // Nota: listProgramaciones retorna una lista plana o agrupada dependiendo de la implementación del servicio,
             // pero el controller filtra por usuarioId si no es admin.
             // Verifiquemos si realmente filtró.
             
             // Si el servicio devuelve array:
             if (Array.isArray(programaciones)) {
                 let pass = true;
                 programaciones.forEach(prog => {
                     // Verificar si la programación pertenece al usuario
                     // Esto depende de la estructura de respuesta del servicio
                     console.log(`   - Programación ID: ${prog.id}, Usuario ID: ${prog.usuarioId}`);
                     if (prog.usuarioId !== technician.id_usuario) {
                         console.error(`   ❌ ERROR: El técnico ve una programación de otro usuario (${prog.usuarioId}).`);
                         pass = false;
                     }
                 });
                 
                 if (pass) console.log('✅ PRUEBA DE PROGRAMACIÓN EXITOSA: Filtro aplicado correctamente.');
                 else console.error('❌ PRUEBA DE PROGRAMACIÓN FALLIDA.');
             }

        } else {
            console.error('❌ Error al obtener programaciones:', mockRes.jsonData);
        }

        // --- TEST 3: PROYECTOS (Admin) - Control ---
        console.log('\n🧪 [TEST 3] Consultando Proyectos como Admin (Control)...');
        const adminRole = await Role.findOne({ where: { nombre_rol: 'Administrador' } });
        const admin = await Users.findOne({ where: { id_rol: adminRole.id_rol } });

        if (admin) {
            const reqAdmin = {
                user: {
                    id_usuario: admin.id_usuario,
                    id_rol: admin.id_rol,
                    rol: 'Administrador'
                },
                query: {}
            };
            
            mockRes.jsonData = null;
            await projectController.getAllProjects(reqAdmin, mockRes);
             if (mockRes.jsonData && mockRes.jsonData.success) {
                const projects = mockRes.jsonData.data;
                console.log(`📊 Proyectos encontrados (Admin): ${projects.length}`);
                // Debería ver más proyectos que el técnico
             }
        }


    } catch (error) {
        console.error('❌ Error fatal en la prueba:', error);
    } finally {
        await sequelize.close();
    }
}

testPermissions();
