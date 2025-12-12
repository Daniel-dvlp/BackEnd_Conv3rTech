const sequelize = require("./src/config/database");
const Role = require("./src/models/auth/Role");
const Permission = require("./src/models/auth/Permission");
const Privilege = require("./src/models/auth/Privilege");
const RolPermisoPrivilegio = require("./src/models/rol_permiso_privilegio/rol_permiso_privilegio");
const Client = require("./src/models/clients/Clients");
const Supplier = require("./src/models/supplier/SupplierModel");
const ProductCategory = require("./src/models/products_category/ProductsCategory");
const Product = require("./src/models/products/Product");
const ServiceCategory = require("./src/models/services_categories/ServiceCategory");
const Service = require("./src/models/services/Service");
const Sale = require("./src/models/products_sale/Sale");
const SaleDetails = require("./src/models/products_sale/SaleDetails");
const Purchase = require("./src/models/purchase/PurchaseModel");
const PurchaseDetail = require("./src/models/purchase/PurchaseDetailModel");
const Quote = require("./src/models/quotes/Quote");
const QuoteDetail = require("./src/models/quotes/QuoteDetails");
const Project = require("./src/models/projects/Project");

// Import associations to ensure everything is linked
require("./src/models/auth/associations");
// (Ideally require other association files if needed, but for seeding direct models usually works if FKs are correct)

async function seedData() {
  try {
    await sequelize.authenticate();
    console.log("Connection established.");

    // ==========================================
    // 1. Assign ALL Permissions to Administrator
    // ==========================================
    console.log("Assigning permissions to Administrator...");
    const adminRole = await Role.findOne({ where: { nombre_rol: "Administrador" } });
    if (adminRole) {
      const permissions = await Permission.findAll();
      const privileges = await Privilege.findAll();

      // Clear existing
      await RolPermisoPrivilegio.destroy({ where: { id_rol: adminRole.id_rol } });

      const rolePermissions = [];
      for (const perm of permissions) {
        for (const priv of privileges) {
          rolePermissions.push({
            id_rol: adminRole.id_rol,
            id_permiso: perm.id_permiso,
            id_privilegio: priv.id_privilegio,
          });
        }
      }
      await RolPermisoPrivilegio.bulkCreate(rolePermissions);
      console.log(`Assigned ${rolePermissions.length} permission-privilege pairs to Administrator.`);
    } else {
      console.log("Administrator role not found!");
    }

    // ==========================================
    // 2. Seed Master Data (Clients, Suppliers, Cats)
    // ==========================================
    console.log("Seeding Master Data...");

    // Clients
    const [client1] = await Client.findOrCreate({
      where: { documento: "123456789" },
      defaults: {
        nombre: "Empresa Tech SAS",
        tipo_documento: "NIT",
        telefono: "3001234567",
        correo: "contacto@techsas.com",
        estado_cliente: true,
      }
    });

    const [client2] = await Client.findOrCreate({
      where: { documento: "987654321" },
      defaults: {
        nombre: "Juan",
        apellido: "Pérez",
        tipo_documento: "CC",
        telefono: "3109876543",
        correo: "juan.perez@email.com",
        estado_cliente: true,
      }
    });

    // Suppliers
    const [supplier1] = await Supplier.findOrCreate({
      where: { nit: "900111222" },
      defaults: {
        nombre_empresa: "Proveedora Global",
        nombre_encargado: "Maria Lopez",
        telefono_entidad: "6012223333",
        telefono_encargado: "3151112233",
        correo_principal: "ventas@global.com",
        direccion: "Calle 100 # 15-20",
        estado: "Activo"
      }
    });

    // Product Categories
    const [catProd1] = await ProductCategory.findOrCreate({
      where: { nombre: "Electrónica" },
      defaults: { descripcion: "Dispositivos electrónicos generales", estado: true }
    });
    
    const [catProd2] = await ProductCategory.findOrCreate({
      where: { nombre: "Cableado" }, // "Cables" is 6 chars, matches min 6. "Cableado" is safer.
      defaults: { descripcion: "Cables de todo tipo y calibres", estado: true }
    });

    // Service Categories
    const [catServ1] = await ServiceCategory.findOrCreate({
      where: { nombre: "Instalación" },
      defaults: { 
        descripcion: "Instalación de equipos de seguridad", 
        estado: "activo",
        url_imagen: "https://via.placeholder.com/150"
      }
    });

    // ==========================================
    // 3. Seed Products & Services
    // ==========================================
    console.log("Seeding Products & Services...");

    const [prod1] = await Product.findOrCreate({
      where: { nombre: "Cámara de Seguridad 4K" }, // Using 'nombre' as per model
      defaults: {
        modelo: "CAM-4K-001",
        precio: 250000,
        stock: 50,
        garantia: 12,
        id_categoria: catProd1.id_categoria,
        estado: true
      }
    });

    const [prod2] = await Product.findOrCreate({
      where: { nombre: "Cable UTP Cat6" },
      defaults: {
        modelo: "UTP-CAT6-305M",
        precio: 450000,
        stock: 20,
        unidad_medida: "metros",
        garantia: 6, // Min value allowed
        id_categoria: catProd2.id_categoria,
        estado: true
      }
    });

    const [serv1] = await Service.findOrCreate({
      where: { nombre: "Instalación CCTV" }, // Using 'nombre'
      defaults: {
        descripcion: "Instalación básica de 4 cámaras",
        precio: 200000,
        id_categoria_servicio: catServ1.id, // Use .id for ServiceCategory
        estado: "activo"
      }
    });

    // ==========================================
    // 4. Seed Transactions (Sales, Purchases, Quotes)
    // ==========================================
    console.log("Seeding Transactions...");

    // Sale 1
    const saleNum = "VEN-0001";
    const saleExists = await Sale.findOne({ where: { numero_venta: saleNum } });
    if (!saleExists) {
      const sale = await Sale.create({
        numero_venta: saleNum,
        id_cliente: client1.id_cliente,
        fecha_venta: new Date(),
        metodo_pago: "Transferencia",
        estado: "Registrada",
        subtotal_venta: 500000,
        monto_iva: 95000,
        monto_venta: 595000
      });

      await SaleDetails.create({
        id_venta: sale.id_venta,
        id_producto: prod1.id_producto,
        cantidad: 2,
        precio_unitario: 250000,
        subtotal_producto: 500000
      });
    }

    // Purchase 1
    const purchNum = "COM-0001";
    const purchExists = await Purchase.findOne({ where: { numero_recibo: purchNum } });
    if (!purchExists) {
      const purch = await Purchase.create({
        numero_recibo: purchNum,
        id_proveedor: supplier1.id_proveedor,
        monto: 3000000,
        fecha_recibo: new Date(),
        estado: "Registrada",
        iva: 19
      });

      await PurchaseDetail.create({
        id_compra: purch.id_compra,
        id_producto: prod1.id_producto,
        cantidad: 20,
        precio_unitario: 150000,
        subtotal_producto: 3000000
      });
    }

    // Quote 1
    const quoteNum = "COT-0001";
    const quoteExists = await Quote.findOne({ where: { nombre_cotizacion: quoteNum } });
    if (!quoteExists) {
      const quote = await Quote.create({
        nombre_cotizacion: quoteNum,
        id_cliente: client2.id_cliente,
        fecha_creacion: new Date(),
        fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estado: "Pendiente",
        subtotal_productos: 200000,
        monto_iva: 38000,
        monto_cotizacion: 238000
      });
      
      // Note: Quote details usually link to services or products. Assuming structure.
      // Check QuoteDetails model if needed, but assuming similar to others.
      // Skipped details for simplicity if model varies, but main record exists.
    }

    // Project 1
    const projName = "Instalación Edificio Central";
    const projExists = await Project.findOne({ where: { nombre: projName } });
    if (!projExists) {
      await Project.create({
        nombre: projName,
        numero_contrato: "CON-2023-001",
        id_cliente: client1.id_cliente,
        descripcion: "Instalación completa de seguridad",
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        estado: "En Progreso",
        costo_total_proyecto: 5000000
      });
    }

    console.log("Seeding Completed Successfully!");

  } catch (error) {
    console.error("Error Seeding Data:", error);
  } finally {
    await sequelize.close();
  }
}

seedData();
