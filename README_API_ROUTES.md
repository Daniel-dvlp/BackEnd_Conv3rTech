# Conv3rTech API - Documentación Completa

## 📋 Índice

1. [Configuración Inicial](#configuración-inicial)
2. [Autenticación](#autenticación)
3. [Gestión de Perfil](#gestión-de-perfil)
4. [Proyectos](#proyectos)
5. [Sistema RBAC (Roles, Permisos y Privilegios)](#sistema-rbac)

---

## 🚀 Configuración Inicial

### Requisitos

- Node.js v18+
- MySQL 8.0+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd BackEnd_Conv3rTech

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Inicializar base de datos
npm run init-rbac

# Iniciar servidor
npm run dev
```

### Variables de Entorno (.env)

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=conv3rtech
DB_PORT=3306

# JWT
JWT_SECRET=conv3rtech-secret-key-2024-super-segura

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Usuario Administrador por Defecto

- **Email:** admin@conv3rtech.com
- **Contraseña:** admin123

---

## 🔐 Autenticación

### Base URL

```
http://localhost:3006/api/auth
```

### 1. Login

```http
POST /login
```

**Body:**

```json
{
  "correo": "admin@conv3rtech.com",
  "contrasena": "admin123"
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "nombre": "Administrador",
      "apellido": "Sistema",
      "correo": "admin@conv3rtech.com",
      "rol": "Administrador"
    }
  },
  "message": "Login exitoso"
}
```

### 2. Registro

```http
POST /register
```

**Body:**

```json
{
  "documento": "12345678",
  "tipo_documento": "CC",
  "nombre": "Juan",
  "apellido": "Pérez",
  "celular": "+573001234567",
  "correo": "juan@example.com",
  "contrasena": "password123",
  "id_rol": 2
}
```

### 3. Verificar Token

```http
GET /verify
```

**Headers:**

```
Authorization: Bearer <token>
```

---

## 👤 Gestión de Perfil

### Base URL

```
http://localhost:3006/api/users
```

### 1. Obtener Mi Perfil

```http
GET /profile/me
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "documento": "12345678",
    "tipo_documento": "CC",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "celular": "+573001234567",
    "correo": "admin@conv3rtech.com",
    "rol": "Administrador",
    "estado": "Activo"
  },
  "message": "Perfil obtenido correctamente"
}
```

### 2. Actualizar Mi Perfil

```http
PUT /profile
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "nombre": "Juan Carlos",
  "apellido": "García",
  "celular": "+573001234568",
  "tipo_documento": "CC",
  "documento": "87654321"
}
```

### 3. Cambiar Mi Contraseña

```http
PATCH /profile/password
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "contrasena_actual": "admin123",
  "contrasena_nueva": "nueva123"
}
```

---

## 📋 Proyectos

### Base URL

```
http://localhost:3006/api/projects
```

### 1. Obtener Todos los Proyectos

```http
GET /
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
?page=1&limit=10&search=proyecto&status=activo
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id_proyecto": 1,
        "nombre_proyecto": "Sistema de Gestión",
        "descripcion": "Desarrollo de sistema integral",
        "fecha_inicio": "2024-01-15",
        "fecha_fin": "2024-06-30",
        "presupuesto": 50000.0,
        "estado": "activo",
        "progreso": 75,
        "cliente": {
          "nombre": "Empresa ABC",
          "documento": "900123456"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  },
  "message": "Proyectos obtenidos correctamente"
}
```

### 2. Obtener Proyecto por ID

```http
GET /:id
```

**Headers:**

```
Authorization: Bearer <token>
```

### 3. Crear Proyecto

```http
POST /
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "nombre_proyecto": "Nuevo Proyecto Web",
  "descripcion": "Desarrollo de aplicación web moderna",
  "fecha_inicio": "2024-03-01",
  "fecha_fin": "2024-08-31",
  "presupuesto": 75000.0,
  "id_cliente": 1,
  "sedes": [
    {
      "nombre_sede": "Sede Principal",
      "direccion": "Calle 123 #45-67",
      "ciudad": "Bogotá",
      "presupuesto_sede": 50000.0
    }
  ],
  "materiales": [
    {
      "id_producto": 1,
      "cantidad": 10,
      "precio_unitario": 150.0
    }
  ],
  "servicios": [
    {
      "id_servicio": 1,
      "cantidad": 5,
      "precio_unitario": 200.0
    }
  ]
}
```

### 4. Actualizar Proyecto

```http
PUT /:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "nombre_proyecto": "Proyecto Web Actualizado",
  "descripcion": "Descripción actualizada",
  "presupuesto": 80000.0
}
```

### 5. Eliminar Proyecto

```http
DELETE /:id
```

**Headers:**

```
Authorization: Bearer <token>
```

### 6. Actualizar Progreso

```http
PATCH /:id/progress
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "progreso": 85
}
```

### 7. Actualizar Estado

```http
PATCH /:id/status
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "estado": "completado"
}
```

### 8. Crear Salida de Material

```http
POST /:id/material-exit
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "id_sede": 1,
  "materiales": [
    {
      "id_producto": 1,
      "cantidad": 5,
      "motivo": "Instalación en sitio"
    }
  ]
}
```

### 9. Obtener Estadísticas

```http
GET /stats
```

**Headers:**

```
Authorization: Bearer <token>
```

### 10. Exportar Proyectos

```http
GET /export
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
?format=excel&status=activo
```

---

## 🛡️ Sistema RBAC (Roles, Permisos y Privilegios)

### Base URL

```
http://localhost:3006/api/rbac
```

### 1. Obtener Mis Permisos

```http
GET /my-permissions
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "permiso": "Usuarios",
      "privilegio": "Crear",
      "permiso_id": 1,
      "privilegio_id": 1
    },
    {
      "permiso": "Proyectos",
      "privilegio": "Leer",
      "permiso_id": 4,
      "privilegio_id": 2
    }
  ],
  "message": "Permisos obtenidos correctamente"
}
```

### 2. Obtener Roles con Permisos

```http
GET /roles-with-permissions
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id_rol": 1,
      "nombre_rol": "Administrador",
      "descripcion": "Rol con acceso completo al sistema",
      "estado": true,
      "permisos": [
        {
          "permiso": "Usuarios",
          "privilegio": "Crear"
        },
        {
          "permiso": "Usuarios",
          "privilegio": "Leer"
        }
      ]
    }
  ],
  "message": "Roles obtenidos correctamente"
}
```

### 3. Asignar Permisos a un Rol

```http
POST /roles/:roleId/permissions
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "permissions": [
    {
      "permiso": "Proyectos",
      "privilegio": "Crear"
    },
    {
      "permiso": "Proyectos",
      "privilegio": "Leer"
    },
    {
      "permiso": "Proyectos",
      "privilegio": "Actualizar"
    }
  ]
}
```

### 4. Obtener Permisos Disponibles

```http
GET /available-permissions
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "permisos": [
      {
        "id": 1,
        "nombre": "Usuarios"
      },
      {
        "id": 2,
        "nombre": "Roles"
      }
    ],
    "privilegios": [
      {
        "id": 1,
        "nombre": "Crear"
      },
      {
        "id": 2,
        "nombre": "Leer"
      }
    ]
  },
  "message": "Permisos disponibles obtenidos correctamente"
}
```

### 5. Crear Nuevo Permiso

```http
POST /permissions
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "nombre": "Reportes Avanzados"
}
```

### 6. Crear Nuevo Privilegio

```http
POST /privileges
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "nombre": "Generar"
}
```

### 7. Obtener Estadísticas RBAC

```http
GET /stats
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "totalRoles": 5,
    "totalPermisos": 10,
    "totalPrivilegios": 8,
    "totalUsers": 25,
    "totalPermisoPrivilegios": 80,
    "totalRolPP": 150,
    "totalCombinations": 80
  },
  "message": "Estadísticas obtenidas correctamente"
}
```

### 8. Obtener Usuarios por Rol

```http
GET /roles/:roleId/users
```

**Headers:**

```
Authorization: Bearer <token>
```

### 9. Verificar Permiso de Usuario

```http
GET /users/:userId/check-permission?permiso=Proyectos&privilegio=Crear
```

**Headers:**

```
Authorization: Bearer <token>
```

### 10. Obtener Permisos de Usuario

```http
GET /users/:userId/permissions
```

**Headers:**

```
Authorization: Bearer <token>
```

---

## 🧪 Scripts de Prueba

### 1. Script de Prueba de Autenticación

```javascript
// test_auth.js
const axios = require("axios");

const BASE_URL = "http://localhost:3006/api";

async function testAuth() {
  try {
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      correo: "admin@conv3rtech.com",
      contrasena: "admin123",
    });

    const token = loginResponse.data.data.token;
    console.log("✅ Login exitoso");

    // Verificar token
    const verifyResponse = await axios.get(`${BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Token válido");

    return token;
  } catch (error) {
    console.error(
      "❌ Error en autenticación:",
      error.response?.data || error.message
    );
  }
}

testAuth();
```

### 2. Script de Prueba de Perfil

```javascript
// test_profile.js
const axios = require("axios");

const BASE_URL = "http://localhost:3006/api";

async function testProfile(token) {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    // Obtener perfil
    const profileResponse = await axios.get(`${BASE_URL}/users/profile/me`, {
      headers,
    });
    console.log("✅ Perfil obtenido:", profileResponse.data.data.nombre);

    // Actualizar perfil
    const updateResponse = await axios.put(
      `${BASE_URL}/users/profile`,
      {
        nombre: "Juan Carlos",
        apellido: "García",
        celular: "+573001234568",
      },
      { headers }
    );
    console.log("✅ Perfil actualizado");

    // Cambiar contraseña
    const passwordResponse = await axios.patch(
      `${BASE_URL}/users/profile/password`,
      {
        contrasena_actual: "admin123",
        contrasena_nueva: "nueva123",
      },
      { headers }
    );
    console.log("✅ Contraseña cambiada");
  } catch (error) {
    console.error("❌ Error en perfil:", error.response?.data || error.message);
  }
}

// Usar con el token obtenido de testAuth()
```

### 3. Script de Prueba de Proyectos

```javascript
// test_projects.js
const axios = require("axios");

const BASE_URL = "http://localhost:3006/api";

async function testProjects(token) {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    // Crear proyecto
    const createResponse = await axios.post(
      `${BASE_URL}/projects`,
      {
        nombre_proyecto: "Proyecto de Prueba",
        descripcion: "Proyecto para testing",
        fecha_inicio: "2024-03-01",
        fecha_fin: "2024-08-31",
        presupuesto: 50000.0,
        id_cliente: 1,
      },
      { headers }
    );

    const projectId = createResponse.data.data.id_proyecto;
    console.log("✅ Proyecto creado:", projectId);

    // Obtener proyecto
    const getResponse = await axios.get(`${BASE_URL}/projects/${projectId}`, {
      headers,
    });
    console.log("✅ Proyecto obtenido");

    // Actualizar progreso
    await axios.patch(
      `${BASE_URL}/projects/${projectId}/progress`,
      {
        progreso: 50,
      },
      { headers }
    );
    console.log("✅ Progreso actualizado");

    // Obtener todos los proyectos
    const allProjectsResponse = await axios.get(`${BASE_URL}/projects`, {
      headers,
    });
    console.log(
      "✅ Proyectos obtenidos:",
      allProjectsResponse.data.data.projects.length
    );
  } catch (error) {
    console.error(
      "❌ Error en proyectos:",
      error.response?.data || error.message
    );
  }
}

// Usar con el token obtenido de testAuth()
```

### 4. Script de Prueba de RBAC

```javascript
// test_rbac.js
const axios = require("axios");

const BASE_URL = "http://localhost:3006/api";

async function testRBAC(token) {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    // Obtener mis permisos
    const permissionsResponse = await axios.get(
      `${BASE_URL}/rbac/my-permissions`,
      { headers }
    );
    console.log("✅ Mis permisos:", permissionsResponse.data.data.length);

    // Obtener roles con permisos
    const rolesResponse = await axios.get(
      `${BASE_URL}/rbac/roles-with-permissions`,
      { headers }
    );
    console.log("✅ Roles obtenidos:", rolesResponse.data.data.length);

    // Obtener permisos disponibles
    const availableResponse = await axios.get(
      `${BASE_URL}/rbac/available-permissions`,
      { headers }
    );
    console.log("✅ Permisos disponibles");

    // Obtener estadísticas
    const statsResponse = await axios.get(`${BASE_URL}/rbac/stats`, {
      headers,
    });
    console.log("✅ Estadísticas RBAC:", statsResponse.data.data);
  } catch (error) {
    console.error("❌ Error en RBAC:", error.response?.data || error.message);
  }
}



## 📝 Notas Importantes

### Headers Requeridos

Para todas las rutas protegidas, incluir:

```

Authorization: Bearer <token>
Content-Type: application/json

````

### Códigos de Respuesta

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error de validación
- `401` - No autenticado
- `403` - No autorizado
- `404` - No encontrado
- `500` - Error interno del servidor

### Validaciones

- Todos los campos requeridos deben estar presentes
- Los emails deben tener formato válido
- Las contraseñas deben tener al menos 6 caracteres
- Los números de teléfono deben tener formato internacional

### Middleware de Permisos

Para usar el middleware de verificación de permisos en nuevas rutas:

```javascript
const { checkPermission } = require("./middlewares/auth/checkPermission");

// Verificar un permiso específico
router.get("/ruta", checkPermission("Modulo", "Accion"), controller.function);

// Verificar múltiples permisos (OR)
router.post(
  "/ruta",
  checkAnyPermission([
    { permiso: "Modulo1", privilegio: "Accion1" },
    { permiso: "Modulo2", privilegio: "Accion2" },
  ]),
  controller.function
);
````

---

## 🔧 Comandos Útiles

```bash
# Inicializar sistema RBAC
npm run init-rbac

# Inicializar base de datos completa
npm run init

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start

# Ejecutar pruebas
node test_complete.js
```

---
