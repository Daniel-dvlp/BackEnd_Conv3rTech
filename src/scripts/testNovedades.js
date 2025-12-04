const axios = require('axios');

async function run() {
  const BASE = process.env.TEST_BASE_URL || `http://localhost:${process.env.PORT || 3006}/api`;
  const email = process.env.TEST_EMAIL || 'daniel.zapb@gmail.com';
  const password = process.env.TEST_PASSWORD || 'Daniel1234^';

  console.log(`[testNovedades] Using base ${BASE}`);

  const loginRes = await axios.post(`${BASE}/auth/login`, { correo: email, contrasena: password });
  const token = loginRes.data?.token || loginRes.data?.accessToken || loginRes.data?.data?.token;
  if (!token) throw new Error('No token from login');
  const api = axios.create({ baseURL: BASE, headers: { Authorization: `Bearer ${token}` } });

  const usersRes = await api.get('/labor-scheduling/usuarios-disponibles');
  const users = usersRes.data?.data || [];
  if (!users.length) throw new Error('No active users available');
  const usuarioId = users[0].id;

  const today = new Date().toISOString().split('T')[0];
  const payload = {
    usuarioIds: [usuarioId],
    titulo: 'Prueba Novedad',
    descripcion: 'Generada por testNovedades',
    color: '#EF4444',
    fechaInicio: today,
    allDay: true
  };

  const createRes = await api.post('/labor-scheduling/novedades', payload);
  const created = createRes.data?.data || [];
  const id = Array.isArray(created) && created[0]?.id_novedad ? created[0].id_novedad : created.id_novedad;
  if (!id) throw new Error('Creation did not return id_novedad');
  console.log(`[testNovedades] Created novedad id=${id}`);

  const eventsRes = await api.get(`/events?rangeStart=${today}&rangeEnd=${today}&usuarioIds=${usuarioId}`);
  const events = eventsRes.data?.data || [];
  const found = events.find(e => String(e.id) === `nov-${id}`);
  if (!found) throw new Error('Created novedad not found in events');
  console.log('[testNovedades] Novedad appears in events');

  await api.delete(`/labor-scheduling/novedades/${id}`);
  console.log('[testNovedades] Cleanup done');
}

run().then(() => {
  console.log('✅ testNovedades OK');
  process.exit(0);
}).catch(err => {
  console.error('❌ testNovedades FAILED', err.message);
  process.exit(1);
});

