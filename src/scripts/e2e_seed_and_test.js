require('dotenv').config();
const sequelize = require('../config/database');

// Asociaciones
require('../models/auth/associations');
require('../models/projects/associations');

// Modelos
const Role = require('../models/auth/Role');
const Permission = require('../models/auth/Permission');
const Privilege = require('../models/auth/Privilege');
const Users = require('../models/users/Users');
const Clients = require('../models/clients/Clients');
const ProductCategory = require('../models/products_category/ProductsCategory');
const Product = require('../models/products/Product');
const ServiceCategory = require('../models/services_categories/ServiceCategory');
const Service = require('../models/services/Service');
const QuoteService = require('../services/quotes/QuoteService');
const QuoteRepository = require('../repositories/quotes/QuoteRepository');
const ProductRepository = require('../repositories/products/ProductRepository');
const ProjectRepository = require('../repositories/projects/ProjectRepository');
const ProjectService = require('../services/projects/ProjectService');
const AuthService = require('../services/auth/AuthService');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// Seeder existente
const seedAuth = require('./seedAuth');

async function ensureBasicData() {
  console.log('🔧 Sembrando RBAC básico...');
  await seedAuth();

  console.log('🔧 Creando categorías de productos y servicios...');
  const [pc] = await ProductCategory.findOrCreate({
    where: { nombre: 'Categoria Demo' },
    defaults: { nombre: 'Categoria Demo', descripcion: 'Categoría de prueba para E2E', estado: true },
  });
  const [sc] = await ServiceCategory.findOrCreate({
    where: { nombre: 'Servicios Demo' },
    defaults: { nombre: 'Servicios Demo', descripcion: 'Categoría de servicios demo', url_imagen: 'http://demo', estado: 'activo' },
  });

  console.log('🔧 Creando productos y servicios demo...');
  const [p1] = await Product.findOrCreate({
    where: { nombre: 'Cable UTP Cat6' },
    defaults: {
      nombre: 'Cable UTP Cat6', modelo: 'CAT6-UTP', id_categoria: pc.id_categoria, unidad_medida: 'metros', precio: 5.00, stock: 1000, garantia: 12, estado: true,
    },
  });
  const [p2] = await Product.findOrCreate({
    where: { nombre: 'Cámara IP 4MP' },
    defaults: {
      nombre: 'Cámara IP 4MP', modelo: 'CAM-4MP', id_categoria: pc.id_categoria, unidad_medida: 'unidad', precio: 120.00, stock: 50, garantia: 24, estado: true,
    },
  });
  const [s1] = await Service.findOrCreate({
    where: { nombre: 'Instalación básica' },
    defaults: {
      nombre: 'Instalación básica', descripcion: 'Servicio de instalación estándar', precio: 80.00, id_categoria_servicio: sc.id, estado: 'activo',
    },
  });

  console.log('🔧 Creando cliente demo...');
  const [client] = await Clients.findOrCreate({
    where: { correo: 'cliente.demo@conv3rtech.com' },
    defaults: {
      documento: 'CLI123456', tipo_documento: 'CC', nombre: 'Cliente', apellido: 'Demo', telefono: '+573001234567', correo: 'cliente.demo@conv3rtech.com', credito: false, estado_cliente: true,
    },
  });

  return { pc, sc, p1, p2, s1, client };
}

async function createQuotesDemo(base) {
  console.log('🧾 Creando cotizaciones demo...');
  const today = new Date();
  const addDays = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString().slice(0,10);

  const q1 = await QuoteService.createQuote({
    nombre_cotizacion: 'Instalación de Cámaras Sede Norte',
    id_cliente: base.client.id_cliente,
    fecha_creacion: today.toISOString().slice(0,10),
    fecha_vencimiento: addDays(15),
    observaciones: 'Proyecto demo 1',
    detalles: [
      { id_producto: base.p2.id_producto, cantidad: 4 },
      { id_servicio: base.s1.id_servicio, cantidad: 1 },
    ],
  });

  const q2 = await QuoteService.createQuote({
    nombre_cotizacion: 'Tendido de Cableado Estructurado',
    id_cliente: base.client.id_cliente,
    fecha_creacion: today.toISOString().slice(0,10),
    fecha_vencimiento: addDays(20),
    observaciones: 'Proyecto demo 2',
    detalles: [
      { id_producto: base.p1.id_producto, cantidad: 200 },
      { id_servicio: base.s1.id_servicio, cantidad: 2 },
    ],
  });

  const q3 = await QuoteService.createQuote({
    nombre_cotizacion: 'Kit de Seguridad Hogar',
    id_cliente: base.client.id_cliente,
    fecha_creacion: today.toISOString().slice(0,10),
    fecha_vencimiento: addDays(10),
    observaciones: 'Proyecto demo 3',
    detalles: [
      { id_producto: base.p2.id_producto, cantidad: 2 },
    ],
  });

  console.log('✅ Cotizaciones creadas:', q1.id_cotizacion, q2.id_cotizacion, q3.id_cotizacion);
  return [q1, q2, q3];
}

async function approveQuotesAndCreateProjects(quotes) {
  console.log('✅ Aprobando cotizaciones y creando proyectos (sin locks)...');
  for (const q of quotes) {
    const updatedQuote = await QuoteRepository.changeQuoteState(q.id_cotizacion, 'Aprobada');

    const existingProject = await require('../models/projects/Project').findOne({ where: { id_cotizacion: q.id_cotizacion } });
    if (!existingProject) {
      const projectData = {
        nombre: updatedQuote.nombre_cotizacion,
        id_cliente: updatedQuote.id_cliente,
        fecha_inicio: updatedQuote.fecha_creacion,
        fecha_fin: updatedQuote.fecha_vencimiento,
        estado: 'Pendiente',
        prioridad: 'Media',
        observaciones: updatedQuote.observaciones || undefined,
        costo_mano_obra: 0,
        costo_total_materiales: parseFloat(updatedQuote.subtotal_productos || 0),
        costo_total_servicios: parseFloat(updatedQuote.subtotal_servicios || 0),
        costo_total_proyecto: parseFloat(updatedQuote.monto_cotizacion || 0),
        id_cotizacion: updatedQuote.id_cotizacion,
        materiales: [],
        servicios: [],
        empleadosAsociados: [],
        sedes: [],
      };
      await ProjectService.createProject(projectData);

      // Marcar convertida y descontar stock de productos
      await require('../models/quotes/Quote').update({ convertida_a_proyecto: true }, { where: { id_cotizacion: q.id_cotizacion } });

      const fullQuote = await QuoteRepository.getQuoteById(q.id_cotizacion);
      for (const detail of fullQuote.detalles || []) {
        if (detail.id_producto && detail.cantidad > 0) {
          const product = detail.producto;
          const newStock = Number(product.stock || 0) - Number(detail.cantidad || 0);
          if (newStock < 0) {
            console.log(`⚠️ Stock insuficiente para producto ${product.nombre}, se evita descuento`);
          } else {
            await ProductRepository.updateStock(detail.id_producto, newStock);
          }
        }
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }

  const projects = await ProjectRepository.getAllProjects();
  console.log('📊 Proyectos creados:', projects.length);
  for (const p of projects.slice(-quotes.length)) {
    console.log(`→ Proyecto ${p.id_proyecto} '${p.nombre}' cliente=${p.id_cliente} estado=${p.estado} id_cotizacion=${p.id_cotizacion}`);
  }
}

async function createExtraRolesAndUsers() {
  console.log('👥 Creando roles extra y usuarios de prueba...');
  const [supervisor] = await Role.findOrCreate({
    where: { nombre_rol: 'Supervisor' },
    defaults: { nombre_rol: 'Supervisor', descripcion: 'Supervisa proyectos', estado: true },
  });
  const [operario] = await Role.findOrCreate({
    where: { nombre_rol: 'Operario' },
    defaults: { nombre_rol: 'Operario', descripcion: 'Operaciones de campo', estado: true },
  });

  const permProyectos = await Permission.findOne({ where: { nombre_permiso: 'Proyectos de servicio' } }) || await Permission.findOne({ where: { nombre_permiso: 'Proyectos' } });
  const privVer = await Privilege.findOne({ where: { nombre_privilegio: 'ver' } });
  const privEditar = await Privilege.findOne({ where: { nombre_privilegio: 'editar' } });

  if (permProyectos && privVer && privEditar) {
    await AuthService.assignRolePermissions(supervisor.id_rol, [
      { id_permiso: permProyectos.id_permiso, privilegios: [{ id_privilegio: privVer.id_privilegio }, { id_privilegio: privEditar.id_privilegio }] },
    ]);
    await AuthService.assignRolePermissions(operario.id_rol, [
      { id_permiso: permProyectos.id_permiso, privilegios: [{ id_privilegio: privVer.id_privilegio }] },
    ]);
  }

  const salt = 12;
  const pass = await bcrypt.hash('Passw0rd!', salt);

  const [u1] = await Users.findOrCreate({
    where: { correo: 'supervisor@conv3rtech.com' },
    defaults: {
      documento: 'SUP123', tipo_documento: 'CC', nombre: 'Sup', apellido: 'Demo', celular: '+573001112233', correo: 'supervisor@conv3rtech.com', contrasena: pass, id_rol: supervisor.id_rol, estado_usuario: 'Activo',
    },
  });

  const [u2] = await Users.findOrCreate({
    where: { correo: 'operario@conv3rtech.com' },
    defaults: {
      documento: 'OPE123', tipo_documento: 'CC', nombre: 'Op', apellido: 'Demo', celular: '+573001223344', correo: 'operario@conv3rtech.com', contrasena: pass, id_rol: operario.id_rol, estado_usuario: 'Activo',
    },
  });

  console.log('✅ Usuarios creados:', u1.id_usuario, u2.id_usuario);
  return { supervisor, operario, u1, u2 };
}

async function testLoginBothWays(userEmail, plainPassword) {
  console.log('🔐 Probando login por servicio...');
  const res1 = await AuthService.login(userEmail, plainPassword);
  console.log('✅ Servicio login OK, token len=', res1.data.token.length);

  console.log('🌐 Probando login por HTTP...');
  try {
    const http = await axios.post('http://localhost:3006/api/auth/login', { correo: userEmail, contrasena: plainPassword });
    console.log('✅ HTTP login OK, token len=', http.data.data.token.length);
  } catch (e) {
    console.log('⚠️ HTTP login falló (¿servidor no iniciado?):', e?.response?.status || e?.message);
  }
}

async function run() {
  try {
    console.log('🚀 Iniciando E2E seed & test...');
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true }); // Disabled to avoid "Too many keys" error
    await sequelize.sync();

    const base = await ensureBasicData();
    const quotes = await createQuotesDemo(base);
    await approveQuotesAndCreateProjects(quotes);

    const { u1, u2 } = await createExtraRolesAndUsers();
    await testLoginBothWays(u1.correo, 'Passw0rd!');
    await testLoginBothWays(u2.correo, 'Passw0rd!');

    console.log('🎉 E2E completado');
    process.exit(0);
  } catch (err) {
    console.error('💥 Error E2E:', err?.message || err);
    process.exit(1);
  } finally {
    try { await sequelize.close(); } catch {}
  }
}

if (require.main === module) {
  run();
}
