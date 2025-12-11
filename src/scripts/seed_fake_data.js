const sequelize = require("../config/database");
const Clients = require("../models/clients/Clients");
const AddressClients = require("../models/clients/AddressClients");
const Supplier = require("../models/supplier/SupplierModel"); // Corrected path
const ProductsCategory = require("../models/products_category/ProductsCategory");
const Product = require("../models/products/Product");
const ServiceCategory = require("../models/services_categories/ServiceCategory"); // Corrected path
const Service = require("../models/services/Service");
const Project = require("../models/projects/Project");
const Users = require("../models/users/Users");
const Quote = require("../models/quotes/Quote");
const Appointment = require("../models/appointments/Appointments");
const Purchase = require("../models/purchase/PurchaseModel");
const Sale = require("../models/products_sale/Sale");

async function seedFakeData() {
  try {
    console.log("Iniciando carga de datos falsos realistas...");
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Asegurar que las tablas existan y estén actualizadas

    // 1. CLIENTES
    console.log("Creando Clientes...");
    const clientsData = [
      {
        nombre: "Conjunto Residencial Los Pinos",
        documento: "900123456",
        tipo_documento: "NIT",
        telefono: "6012345678",
        correo: "admin@lospinos.com",
        estado_cliente: true,
        credito: true
      },
      {
        nombre: "Seguridad Privada El Águila Ltda",
        documento: "900987654",
        tipo_documento: "NIT",
        telefono: "3101234567",
        correo: "gerencia@seguridadaguila.com",
        estado_cliente: true,
        credito: true
      },
      {
        nombre: "Banco Nacional - Sede Centro",
        documento: "800111222",
        tipo_documento: "NIT",
        telefono: "6013334444",
        correo: "infraestructura@banconacional.com",
        estado_cliente: true,
        credito: true
      },
      {
        nombre: "Carlos Rodríguez",
        apellido: "Gómez",
        documento: "79123456",
        tipo_documento: "CC",
        telefono: "3159876543",
        correo: "carlos.rod@gmail.com",
        estado_cliente: true,
        credito: false
      }
    ];
    const createdClients = [];
    for (const c of clientsData) {
      const [client] = await Clients.findOrCreate({ where: { documento: c.documento }, defaults: c });
      createdClients.push(client);
      
      await AddressClients.findOrCreate({
        where: { id_cliente: client.id_cliente, nombre_direccion: "Principal" },
        defaults: {
          id_cliente: client.id_cliente,
          nombre_direccion: "Principal",
          direccion: "Calle 123 # 45-67",
          ciudad: "Bogotá"
        }
      });
    }

    // 2. PROVEEDORES
    console.log("Creando Proveedores...");
    const suppliersData = [
      {
        nombre_empresa: "Distribuidora Hikvision Colombia",
        nombre_encargado: "Ana María Gómez",
        telefono_entidad: "3201112233",
        correo_principal: "ventas@hikvisiondist.co",
        direccion: "Av. El Dorado # 26-80",
        estado: "Activo"
      },
      {
        nombre_empresa: "Cables y Conexiones SAS",
        nombre_encargado: "Jorge Pérez",
        telefono_entidad: "3105556677",
        correo_principal: "jorge@cablesas.com",
        direccion: "Calle 80 # 10-20",
        estado: "Activo"
      },
      {
        nombre_empresa: "Tecnología Global Importadores",
        nombre_encargado: "Luis Torres",
        telefono_entidad: "6017778899",
        correo_principal: "contacto@tecglobal.com",
        direccion: "Carrera 15 # 93-60",
        estado: "Activo"
      }
    ];
    
    for (const s of suppliersData) {
      await Supplier.findOrCreate({ where: { nombre_empresa: s.nombre_empresa }, defaults: s });
    }

    // 3. CATEGORÍAS DE PRODUCTOS
    console.log("Creando Categorías de Productos...");
    const prodCats = [
      { nombre: "Cámaras de Seguridad", descripcion: "Cámaras IP, Análogas, PTZ", estado: true },
      { nombre: "Grabación (DVR/NVR)", descripcion: "Grabadores digitales y de red", estado: true },
      { nombre: "Cableado Estructurado", descripcion: "Cables UTP, Fibra, Coaxial", estado: true },
      { nombre: "Control de Acceso", descripcion: "Biométricos, Tarjetas, Electroimanes", estado: true },
      { nombre: "Accesorios", descripcion: "Conectores, Fuentes, Baluns", estado: true }
    ];

    const createdProdCats = {};
    for (const cat of prodCats) {
      const [c] = await ProductsCategory.findOrCreate({ where: { nombre: cat.nombre }, defaults: cat });
      createdProdCats[cat.nombre] = c.id_categoria;
    }

    // 4. PRODUCTOS
    console.log("Creando Productos...");
    const productsData = [
      {
        nombre: "Cámara Bullet Hikvision 2MP",
        modelo: "DS-2CE16D0T-IRF",
        precio: 120000,
        stock: 50,
        garantia: 12,
        id_categoria: createdProdCats["Cámaras de Seguridad"],
        estado: true
      },
      {
        nombre: "Cámara Domo Dahua 4MP Audio",
        modelo: "HAC-HDW1400EM-A",
        precio: 250000,
        stock: 30,
        garantia: 24,
        id_categoria: createdProdCats["Cámaras de Seguridad"],
        estado: true
      },
      {
        nombre: "DVR Hikvision 8 Canales",
        modelo: "DS-7208HQHI-K1",
        precio: 450000,
        stock: 15,
        garantia: 24,
        id_categoria: createdProdCats["Grabación (DVR/NVR)"],
        estado: true
      },
      {
        nombre: "Bobina Cable UTP Cat6 305m",
        modelo: "DS-1LN6-UU",
        precio: 580000,
        stock: 100,
        garantia: 12,
        unidad_medida: "metros",
        id_categoria: createdProdCats["Cableado Estructurado"],
        estado: true
      },
      {
        nombre: "Conector RJ45 Cat6 (Bolsa x100)",
        modelo: "RJ45-CAT6",
        precio: 45000,
        stock: 200,
        garantia: 6,
        unidad_medida: "paquetes",
        id_categoria: createdProdCats["Accesorios"],
        estado: true
      },
      {
        nombre: "Control de Acceso Biométrico ZK",
        modelo: "K40",
        precio: 380000,
        stock: 10,
        garantia: 12,
        id_categoria: createdProdCats["Control de Acceso"],
        estado: true
      }
    ];

    for (const p of productsData) {
      if (p.id_categoria) {
        await Product.findOrCreate({ where: { nombre: p.nombre }, defaults: p });
      }
    }

    // 5. CATEGORÍAS DE SERVICIOS
    console.log("Creando Categorías de Servicios...");
    const servCats = [
      { nombre: "Instalación", descripcion: "Mano de obra de instalación", estado: "activo", url_imagen: "default.jpg" },
      { nombre: "Mantenimiento", descripcion: "Preventivo y correctivo", estado: "activo", url_imagen: "default.jpg" },
      { nombre: "Configuración", descripcion: "Configuración lógica y redes", estado: "activo", url_imagen: "default.jpg" }
    ];

    const createdServCats = {};
    for (const cat of servCats) {
      const [c] = await ServiceCategory.findOrCreate({ where: { nombre: cat.nombre }, defaults: cat });
      createdServCats[cat.nombre] = c.id; // id field is 'id' in model but mapped to 'id_categoria_servicio'
    }

    // 6. SERVICIOS
    console.log("Creando Servicios...");
    const servicesData = [
      {
        nombre: "Instalación de punto de red",
        descripcion: "Cableado, ponchado y certificación básica",
        precio: 45000,
        id_categoria_servicio: createdServCats["Instalación"],
        estado: "activo"
      },
      {
        nombre: "Instalación cámara altura < 3m",
        descripcion: "Montaje, enfoque y conexión de cámara",
        precio: 60000,
        id_categoria_servicio: createdServCats["Instalación"],
        estado: "activo"
      },
      {
        nombre: "Mantenimiento Cámara CCTV",
        descripcion: "Limpieza lente, ajuste enfoque, verificación voltaje",
        precio: 35000,
        id_categoria_servicio: createdServCats["Mantenimiento"],
        estado: "activo"
      },
      {
        nombre: "Configuración DVR/NVR Acceso Remoto",
        descripcion: "Apertura puertos, configuración P2P/DDNS",
        precio: 80000,
        id_categoria_servicio: createdServCats["Configuración"],
        estado: "activo"
      }
    ];

    for (const s of servicesData) {
      if (s.id_categoria_servicio) {
        await Service.findOrCreate({ where: { nombre: s.nombre }, defaults: s });
      }
    }

    // 7. USUARIOS
    const users = await Users.findAll();
    const coordinador = users.find(u => u.id_rol === 2);
    const tecnico = users.find(u => u.id_rol === 3);

    // 8. PROYECTOS
    console.log("Creando Proyectos...");
    if (createdClients.length > 0 && coordinador) {
      const projectsData = [
        {
          numero_contrato: "CT-2024-001",
          nombre: "Instalación CCTV Edificio Los Pinos",
          descripcion: "Instalación de 16 cámaras y control de acceso peatonal",
          fecha_inicio: new Date(),
          fecha_fin: new Date(new Date().setDate(new Date().getDate() + 30)),
          estado: "En Progreso",
          prioridad: "Alta",
          ubicacion: "Calle 123 # 45-67",
          id_cliente: createdClients[0].id_cliente,
          id_responsable: coordinador.id_usuario,
          costo_total_proyecto: 5000000
        },
        {
          numero_contrato: "CT-2024-002",
          nombre: "Mantenimiento Banco Nacional",
          descripcion: "Mantenimiento preventivo de sistema de alarmas y CCTV",
          fecha_inicio: new Date(),
          fecha_fin: new Date(new Date().setDate(new Date().getDate() + 5)),
          estado: "Pendiente",
          prioridad: "Media",
          ubicacion: "Av. Central # 10-10",
          id_cliente: createdClients[2].id_cliente,
          id_responsable: coordinador.id_usuario,
          costo_total_proyecto: 1500000
        }
      ];

      for (const proj of projectsData) {
        await Project.findOrCreate({ where: { numero_contrato: proj.numero_contrato }, defaults: proj });
      }
    }

    // 9. CITAS
    console.log("Creando Citas...");
    if (createdClients.length > 0 && tecnico) {
      // Asegurar que existe la dirección antes de asociar
      const address = await AddressClients.findOne({ where: { id_cliente: createdClients[0].id_cliente } });

      const appointmentsData = [
        {
          fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          hora_inicio: "09:00",
          hora_fin: "11:00",
          estado: "Pendiente",
          observaciones: "Visita Técnica Inicial Los Pinos",
          direccion: "Conjunto Los Pinos",
          id_direccion: address ? address.id_direccion : null,
          id_cliente: createdClients[0].id_cliente,
          id_usuario: tecnico.id_usuario
        },
        {
          fecha: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
          hora_inicio: "14:00",
          hora_fin: "16:00",
          estado: "Confirmada",
          observaciones: "Mantenimiento Correctivo Cámara 4",
          direccion: "Banco Nacional",
          id_direccion: null,
          id_cliente: createdClients[2].id_cliente,
          id_usuario: tecnico.id_usuario
        }
      ];

      for (const app of appointmentsData) {
        // Check duplicate simply by user and date/time
        const existing = await Appointment.findOne({ 
            where: { 
                id_usuario: app.id_usuario, 
                fecha: app.fecha,
                hora_inicio: app.hora_inicio 
            } 
        });
        if (!existing) {
          await Appointment.create(app);
        }
      }
    }

    console.log("¡Carga de datos falsos completada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("Error cargando datos:", error);
    process.exit(1);
  }
}

seedFakeData();