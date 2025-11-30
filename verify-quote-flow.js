const axios = require('axios');

// Configuración
// NOTA: La API corre localmente (localhost:3007) pero se conecta a la BD remota (Aiven) definida en .env
const API_BASE_URL = 'http://localhost:3007/api';

console.log('🔍 VERIFICACIÓN DE FLUJO DE COTIZACIÓN -> PROYECTO 🔍');
console.log('=====================================================');
console.log(`API: ${API_BASE_URL}`);
console.log('');

// Cliente axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

async function verifyQuoteFlow() {
  try {
    // 1. Autenticación
    console.log('1️⃣ AUTENTICACIÓN');
    console.log('==================');
    
    const authResponse = await api.post('/auth/login', {
      correo: 'admin@conv3rtech.com',
      contrasena: 'admin123'
    });
    
    if (authResponse.data.success) {
      const token = authResponse.data.data.token;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('✅ Autenticación exitosa');
    } else {
      console.log('❌ Error en autenticación');
      return;
    }
    
    console.log('');

    // 1.1 Verificar Health
    console.log('1️⃣.1️⃣ VERIFICAR HEALTH');
    console.log('=======================');
    try {
      const healthResponse = await api.get('/health');
      console.log('✅ Health check exitoso:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health check falló:', error.message);
    }
    console.log('');

    // 1.2 Verificar Usuarios (Test de ruta protegida existente)
    console.log('1️⃣.2️⃣ VERIFICAR ROUTE USERS');
    console.log('=======================');
    try {
        // Asumiendo que existe /users
        const usersResponse = await api.get('/users');
        console.log('✅ Users fetch exitoso. Status:', usersResponse.status);
    } catch (error) {
        console.log('⚠️ Users fetch falló (esto es esperado si la ruta no es /users):', error.message, error.response?.status);
    }
    console.log('');

    // 2. Crear Cotización
    console.log('2️⃣ CREAR COTIZACIÓN');
    console.log('=====================');

    // Necesitamos un cliente y un producto válidos. 
    // Buscaremos el primer cliente y producto disponible.
    const clientsResponse = await api.get('/clients');
    const productsResponse = await api.get('/products');

    if (!clientsResponse.data.length || !productsResponse.data.length) {
        console.error("❌ No hay clientes o productos para crear la cotización.");
        return;
    }

    const cliente = clientsResponse.data[0];
    const producto = productsResponse.data[0];

    console.log(`   Cliente: ${cliente.nombre} (ID: ${cliente.id_cliente})`);
    console.log(`   Producto: ${producto.nombre} (ID: ${producto.id_producto})`);

    const quotePayload = {
        nombre_cotizacion: `Cotización de Prueba ${Date.now()}`,
        id_cliente: cliente.id_cliente,
        fecha_vencimiento: new Date(Date.now() + 86400000).toISOString(), // Mañana
        estado: 'Pendiente',
        observaciones: 'Prueba automática de flujo',
        detalles: [
            {
                id_producto: producto.id_producto,
                cantidad: 1
            }
        ]
    };

    const createQuoteResponse = await api.post('/quotes', quotePayload);
    const quote = createQuoteResponse.data.data;
    console.log(`✅ Cotización creada: ID ${quote.id_cotizacion}, Estado: ${quote.estado}`);

    console.log('');

    // 3. Aprobar Cotización
    console.log('3️⃣ APROBAR COTIZACIÓN');
    console.log('=======================');

    const approvePayload = {
        estado: 'Aprobada'
    };

    const approveResponse = await api.patch(`/quotes/${quote.id_cotizacion}/estado`, approvePayload);
    console.log(`✅ Respuesta de aprobación: ${approveResponse.status}`);
    console.log(`   Mensaje: ${approveResponse.data.message}`);
    
    const updatedQuote = approveResponse.data.data;
    console.log(`   Nuevo Estado: ${updatedQuote.estado}`);

    console.log('');

    // 4. Verificar Proyecto Creado
    console.log('4️⃣ VERIFICAR PROYECTO');
    console.log('=======================');

    // Buscamos proyectos vinculados a esta cotización
    const projectsResponse = await api.get('/projects');
    const projects = projectsResponse.data.data || projectsResponse.data; // Ajuste según estructura de respuesta

    // Buscar proyecto por id_cotizacion (si el API lo expone en el listado o detalle)
    // Asumimos que el nombre coincide
    const project = projects.find(p => p.nombre === quote.nombre_cotizacion);

    if (project) {
        console.log(`✅ Proyecto encontrado: ID ${project.id}, Nombre: ${project.nombre}`);
        console.log(`   Contrato: ${project.numeroContrato}`);
        console.log(`   Estado: ${project.estado}`);
    } else {
        console.log(`⚠️ No se encontró un proyecto con el nombre "${quote.nombre_cotizacion}" en la lista.`);
        // Intentar buscar detalles de la cotización para ver si tiene proyecto linkeado? No hay endpoint obvio para eso inverso.
    }

    console.log('');
    console.log('🎉 FLUJO COMPLETADO 🎉');

  } catch (error) {
    console.log('❌ Error detectado:');
    console.log('   Tipo:', error.name);
    console.log('   Mensaje:', error.message);
    
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Respuesta:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

verifyQuoteFlow();
