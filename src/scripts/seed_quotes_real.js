const sequelize = require("../config/database");
const Quote = require("../models/quotes/Quote");
const QuoteDetail = require("../models/quotes/QuoteDetails");
const Client = require("../models/clients/Clients");
const Product = require("../models/products/Product");
const Service = require("../models/services/Service");

const seedQuotes = async () => {
  try {
    // Authenticate and sync (optional, but good to ensure connection)
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Fetch Clients, Products, and Services
    const clients = await Client.findAll();
    const products = await Product.findAll();
    const services = await Service.findAll();

    if (clients.length === 0) {
      console.error("No clients found. Cannot create quotes.");
      return;
    }

    if (products.length === 0 && services.length === 0) {
      console.error("No products or services found. Cannot create quotes.");
      return;
    }

    console.log(`Found ${clients.length} clients, ${products.length} products, ${services.length} services.`);

    const quotesToCreate = [];

    // Helper to get random item from array
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // Helper to get random number between min and max
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Helper to add days to date
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Generate 8 quotes
    for (let i = 0; i < 8; i++) {
      const client = getRandom(clients);
      const creationDate = new Date();
      const expirationDate = addDays(creationDate, 15);
      
      // Randomly decide how many items (products/services)
      const numItems = getRandomInt(1, 4);
      let subtotalProductos = 0;
      let subtotalServicios = 0;
      const details = [];

      for (let j = 0; j < numItems; j++) {
        // Randomly choose product or service
        const isProduct = Math.random() > 0.5;
        
        if (isProduct && products.length > 0) {
            const product = getRandom(products);
            const qty = getRandomInt(1, 5);
            const subtotal = qty * parseFloat(product.precio);
            
            details.push({
                id_producto: product.id_producto,
                cantidad: qty,
                precio_unitario: parseFloat(product.precio),
                subtotal: subtotal
            });
            subtotalProductos += subtotal;
        } else if (services.length > 0) {
            const service = getRandom(services);
            const qty = getRandomInt(1, 3);
            const subtotal = qty * parseFloat(service.precio);

            details.push({
                id_servicio: service.id_servicio,
                cantidad: qty,
                precio_unitario: parseFloat(service.precio),
                subtotal: subtotal
            });
            subtotalServicios += subtotal;
        }
      }

      const iva = (subtotalProductos + subtotalServicios) * 0.19;
      const total = subtotalProductos + subtotalServicios + iva;

      // Shorten the name to fit in the column (likely 50 chars)
      const baseName = `Coti ${i + 1} - ${client.nombre}`;
      const truncatedName = baseName.substring(0, 45); // Safe margin

      quotesToCreate.push({
        id_cliente: client.id_cliente,
        nombre_cotizacion: truncatedName,
        fecha_creacion: creationDate,
        fecha_vencimiento: expirationDate,
        subtotal_productos: subtotalProductos,
        subtotal_servicios: subtotalServicios,
        monto_iva: iva,
        monto_cotizacion: total,
        estado: "Pendiente",
        observaciones: "Cotización generada automáticamente para pruebas.",
        detalles: details
      });
    }

    // Insert Quotes and Details
    for (const quoteData of quotesToCreate) {
        const { detalles, ...quoteHeader } = quoteData;
        
        const createdQuote = await Quote.create(quoteHeader);
        
        if (detalles && detalles.length > 0) {
            const detailsWithId = detalles.map(d => ({
                ...d,
                id_cotizacion: createdQuote.id_cotizacion
            }));
            await QuoteDetail.bulkCreate(detailsWithId);
        }
        console.log(`Created Quote ID: ${createdQuote.id_cotizacion} for Client: ${quoteHeader.id_cliente}`);
    }

    console.log("Successfully created 8 quotes.");

  } catch (error) {
    console.error("Error seeding quotes:", error);
  } finally {
    await sequelize.close();
  }
};

seedQuotes();
