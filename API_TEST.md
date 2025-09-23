# API Testing Guide - Conv3rTech

## Configuración Base

**Base URL:** `http://localhost:3006/api`

**Headers por defecto:**

```
Content-Type: application/json
```

**Headers con autenticación:**

```
Content-Type: application/json
Authorization: Bearer {token}
```

---

## 1. AUTENTICACIÓN Y AUTORIZACIÓN

### 1.1 Inicio de Sesión

```http
POST /auth/login
Content-Type: application/json

{
  "correo": "admin@conv3rtech.com",
  "contrasena": "admin123"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@conv3rtech.com",
      "name": "Admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Renovación de Token

```http
POST /auth/refresh
Authorization: Bearer {access_token_actual}
```

**Nota:** Esta API regenera el token usando el token actual, no usa refresh tokens tradicionales.

````

### 1.3 Obtener Perfil del Usuario

```http
GET /auth/profile
Authorization: Bearer {token}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "nombre": "Admin",
    "apellido": "User",
    "email": "admin@conv3rtech.com",
    "celular": "3001234567",
    "documento": "1234567890",
    "tipoDocumento": "CC",
    "rol": "admin",
    "estado_usuario": "Activo",
    "fecha_creacion": "2024-01-01T00:00:00.000Z"
  },
  "message": "Perfil obtenido exitosamente"
}
````

### 1.4 Actualizar Perfil

```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "apellido": "Nuevo Apellido",
  "email": "nuevo@email.com",
  "celular": "3001234567",
  "documento": "1234567890",
  "tipoDocumento": "CC"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "nombre": "Nuevo Nombre",
    "apellido": "Nuevo Apellido",
    "email": "nuevo@email.com",
    "celular": "3001234567",
    "documento": "1234567890",
    "tipoDocumento": "CC",
    "rol": "admin",
    "estado_usuario": "Activo",
    "fecha_creacion": "2024-01-01T00:00:00.000Z"
  },
  "message": "Perfil actualizado exitosamente"
}
```

### 1.5 Cambiar Contraseña

```http
PUT /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "nueva123"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

### 1.6 Obtener Mis Permisos

```http
GET /auth/permissions
Authorization: Bearer {token}
```

### 1.7 Cerrar Sesión

```http
POST /auth/logout
Authorization: Bearer {token}
```

---

## 2. GESTIÓN DE ROLES

### 2.1 Obtener Todos los Roles

```http
GET /roles
Authorization: Bearer {token}
```

### 2.2 Obtener Rol por ID

```http
GET /roles/{id}
Authorization: Bearer {token}
```

### 2.3 Crear Nuevo Rol

```http
POST /roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_rol": "Editor",
  "descripcion": "Rol de editor con permisos limitados"
}
```

### 2.4 Actualizar Rol

```http
PUT /roles/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_rol": "Editor Senior",
  "descripcion": "Rol de editor senior con más permisos"
}
```

### 2.5 Eliminar Rol

```http
DELETE /roles/{id}
Authorization: Bearer {token}
```

### 2.6 Obtener Roles con Permisos

```http
GET /roles/roles-with-permissions
Authorization: Bearer {token}
```

### 2.7 Obtener Resumen de Permisos

```http
GET /roles/permissions-summary
Authorization: Bearer {token}
```

---

## 3. GESTIÓN DE PERMISOS

### 3.1 Obtener Todos los Permisos

```http
GET /permissions
Authorization: Bearer {token}
```

### 3.2 Obtener Permiso por ID

```http
GET /permissions/{id}
Authorization: Bearer {token}
```

### 3.3 Crear Nuevo Permiso

```http
POST /permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_permiso": "read_products",
  "descripcion": "Permiso para leer productos"
}
```

### 3.4 Actualizar Permiso

```http
PUT /permissions/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_permiso": "read_products",
  "descripcion": "Permiso para leer y listar productos"
}
```

### 3.5 Eliminar Permiso

```http
DELETE /permissions/{id}
Authorization: Bearer {token}
```

---

## 4. GESTIÓN DE PRIVILEGIOS

### 4.1 Obtener Todos los Privilegios

```http
GET /privileges
Authorization: Bearer {token}
```

### 4.2 Obtener Privilegio por ID

```http
GET /privileges/{id}
Authorization: Bearer {token}
```

### 4.3 Crear Nuevo Privilegio

```http
POST /privileges
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_privilegio": "create",
  "descripcion": "Privilegio para crear recursos"
}
```

### 4.4 Actualizar Privilegio

```http
PUT /privileges/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_privilegio": "create",
  "descripcion": "Privilegio para crear y modificar recursos"
}
```

### 4.5 Eliminar Privilegio

```http
DELETE /privileges/{id}
Authorization: Bearer {token}
```

---

## 5. ASIGNACIÓN DE PERMISOS A ROLES

**⚠️ IMPORTANTE: Formato del Body**

El sistema utiliza un modelo de relación ternaria donde cada registro en `rol_permiso_privilegio` contiene:

- `id_rol` (del parámetro de la URL)
- `id_permiso`
- `id_privilegio`

**Estructura del Body:**

```json
{
  "permisos": [
    {
      "id_permiso": 1,
      "privilegios": [
        {
          "id_privilegio": 1
        }
      ]
    }
  ]
}
```

**Ejemplos de Uso:**

1. **Un permiso con un privilegio:**

```json
{
  "permisos": [
    {
      "id_permiso": 2,
      "privilegios": [
        {
          "id_privilegio": 1
        }
      ]
    }
  ]
}
```

2. **Un permiso con múltiples privilegios:**

```json
{
  "permisos": [
    {
      "id_permiso": 2,
      "privilegios": [
        {
          "id_privilegio": 1
        },
        {
          "id_privilegio": 3
        }
      ]
    }
  ]
}
```

3. **Múltiples permisos con múltiples privilegios:**

```json
{
  "permisos": [
    {
      "id_permiso": 2,
      "privilegios": [
        {
          "id_privilegio": 1
        }
      ]
    },
    {
      "id_permiso": 5,
      "privilegios": [
        {
          "id_privilegio": 2
        }
      ]
    }
  ]
}
```

### 5.1 Asignar Permiso a Rol

```http
POST /roles/{roleId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permisos": [
    {
      "id_permiso": 1,
      "privilegios": [
        {
          "id_privilegio": 1
        }
      ]
    }
  ]
}
```

### 5.2 Obtener Permisos de un Rol

```http
GET /roles/{roleId}/permissions
Authorization: Bearer {token}
```

### 5.3 Remover Permiso de un Rol

```http
DELETE /roles/{roleId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permisos": [
    {
      "id_permiso": 1,
      "privilegios": [
        {
          "id_privilegio": 1
        }
      ]
    }
  ]
}
```

### 5.4 Asignar Múltiples Permisos a un Rol

```http
POST /roles/{roleId}/permissions/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
  "permisos": [
    {
      "id_permiso": 1,
      "privilegios": [
        {
          "id_privilegio": 1
        },
        {
          "id_privilegio": 2
        }
      ]
    },
    {
      "id_permiso": 2,
      "privilegios": [
        {
          "id_privilegio": 1
        },
        {
          "id_privilegio": 3
        }
      ]
    }
  ]
}
```

---

## 6. GESTIÓN DE USUARIOS

### 6.1 Obtener Todos los Usuarios

```http
GET /users
Authorization: Bearer {token}
```

### 6.2 Obtener Usuario por ID

```http
GET /users/{id}
Authorization: Bearer {token}
```

### 6.3 Crear Nuevo Usuario

```http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@conv3rtech.com",
  "contrasena": "password123",
  "id_rol": 2,
  "documento": "1234567890",
  "tipo_documento": "CC",
  "celular": "3001234567"
}
```

### 6.4 Actualizar Usuario

```http
PUT /users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez Actualizado",
  "correo": "juan.nuevo@conv3rtech.com",
  "id_rol": 2
}
```

### 6.5 Eliminar Usuario

```http
DELETE /users/{id}
Authorization: Bearer {token}
```

### 6.6 Obtener Mi Perfil

```http
GET /users/profile/me
Authorization: Bearer {token}
```

### 6.7 Actualizar Mi Perfil

```http
PUT /users/profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Mi Nombre",
  "apellido": "Actualizado",
  "correo": "mi.nuevo@email.com"
}
```

### 6.8 Cambiar Mi Contraseña

```http
PUT /users/profile/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "nueva123",
  "confirmPassword": "nueva123"
}
```

---

## 7. GESTIÓN DE PRODUCTOS

### 7.1 Obtener Todos los Productos

```http
GET /products/products
Authorization: Bearer {token}
```

### 7.2 Obtener Producto por ID

```http
GET /products/products/{id}
Authorization: Bearer {token}
```

### 7.3 Crear Nuevo Producto

```http
POST /products/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Producto Test",
  "modelo": "MOD-001",
  "id_categoria": 1,
  "precio": 99.99,
  "stock": 100,
  "garantia": 12,
  "unidad_medida": "unidad"
}
```

### 7.4 Actualizar Producto

```http
PUT /products/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "modelo": "MOD-002",
  "precio": 149.99,
  "stock": 150,
  "garantia": 24
}
```

### 7.5 Eliminar Producto

```http
DELETE /products/products/{id}
Authorization: Bearer {token}
```

### 7.6 Cambiar Estado del Producto

```http
PATCH /products/products/{id}/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "inactivo"
}
```

---

## 8. GESTIÓN DE CARACTERÍSTICAS DE PRODUCTOS

### 8.1 Obtener Todas las Características

```http
GET /products/features
Authorization: Bearer {token}
```

### 8.2 Obtener Característica por ID

```http
GET /products/features/{id}
Authorization: Bearer {token}
```

### 8.3 Crear Nueva Característica

```http
POST /products/features
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Color"
}
```

### 8.4 Actualizar Característica

```http
PUT /products/features/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Color"
}
```

### 8.5 Eliminar Característica

```http
DELETE /products/features/{id}
Authorization: Bearer {token}
```

---

## 9. GESTIÓN DE HOJAS TÉCNICAS

### 9.1 Obtener Todas las Hojas Técnicas

```http
GET /products/datasheets
Authorization: Bearer {token}
```

### 9.2 Obtener Hoja Técnica por ID

```http
GET /products/datasheets/{id}
Authorization: Bearer {token}
```

### 9.3 Crear Nueva Hoja Técnica

```http
POST /products/datasheets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Especificaciones Técnicas",
  "content": "Contenido de la hoja técnica",
  "productId": 1
}
```

### 9.4 Actualizar Hoja Técnica

```http
PUT /products/datasheets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Especificaciones Técnicas Actualizadas",
  "content": "Nuevo contenido de la hoja técnica",
  "productId": 1
}
```

### 9.5 Eliminar Hoja Técnica

```http
DELETE /products/datasheets/{id}
Authorization: Bearer {token}
```

---

## 10. GESTIÓN DE CATEGORÍAS DE PRODUCTOS

### 10.1 Obtener Todas las Categorías

```http
GET /productsCategory
Authorization: Bearer {token}
```

### 10.2 Obtener Categoría por ID

```http
GET /productsCategory/{id}
Authorization: Bearer {token}
```

### 10.3 Crear Nueva Categoría

```http
POST /productsCategory
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Electrónicos",
  "descripcion": "Productos electrónicos"
}
```

### 10.4 Actualizar Categoría

```http
PUT /productsCategory/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Electrónicos Avanzados",
  "descripcion": "Productos electrónicos de alta tecnología"
}
```

### 10.5 Eliminar Categoría

```http
DELETE /productsCategory/{id}
Authorization: Bearer {token}
```

---

## 11. GESTIÓN DE CLIENTES

### 11.1 Obtener Todos los Clientes

```http
GET /clients
Authorization: Bearer {token}
```

### 11.2 Obtener Cliente por ID

```http
GET /clients/{id}
Authorization: Bearer {token}
```

### 11.3 Crear Nuevo Cliente

```http
POST /clients
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Cliente",
  "apellido": "Test",
  "correo": "cliente@test.com",
  "telefono": "123456789",
  "tipo_documento": "CC",
  "documento": "12345678"
}
```

### 11.4 Actualizar Cliente

```http
PUT /clients/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Cliente",
  "apellido": "Actualizado",
  "correo": "cliente.actualizado@test.com",
  "telefono": "987654321",
  "tipo_documento": "CC",
  "documento": "87654321"
}
```

### 11.5 Eliminar Cliente

```http
DELETE /clients/{id}
Authorization: Bearer {token}
```

---

## 12. GESTIÓN DE DIRECCIONES DE CLIENTES

### 12.1 Obtener Todas las Direcciones

```http
GET /address-clients
Authorization: Bearer {token}
```

### 12.2 Obtener Dirección por ID

```http
GET /address-clients/{id}
Authorization: Bearer {token}
```

### 12.3 Crear Nueva Dirección

```http
POST /address-clients
Authorization: Bearer {token}
Content-Type: application/json

{
  "street": "Calle 123",
  "city": "Bogotá",
  "state": "Cundinamarca",
  "zipCode": "110111",
  "clientId": 1
}
```

### 12.4 Actualizar Dirección

```http
PUT /address-clients/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "street": "Calle 456",
  "city": "Medellín",
  "state": "Antioquia",
  "zipCode": "050001",
  "clientId": 1
}
```

### 12.5 Eliminar Dirección

```http
DELETE /address-clients/{id}
Authorization: Bearer {token}
```

---

## 13. GESTIÓN DE PROVEEDORES

### 13.1 Obtener Todos los Proveedores

```http
GET /suppliers
Authorization: Bearer {token}
```

### 13.2 Obtener Proveedor por ID

```http
GET /suppliers/{id}
Authorization: Bearer {token}
```

### 13.3 Crear Nuevo Proveedor

```http
POST /suppliers
Authorization: Bearer {token}
Content-Type: application/json

{
  "nit": "123456789-0",
  "nombre_encargado": "Juan Pérez",
  "nombre_empresa": "Proveedor Test",
  "telefono": "123456789",
  "correo": "proveedor@test.com",
  "direccion": "Dirección del proveedor"
}
```

### 13.4 Actualizar Proveedor

```http
PUT /suppliers/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_encargado": "Juan Pérez Actualizado",
  "nombre_empresa": "Proveedor Actualizado",
  "telefono": "987654321",
  "correo": "proveedor.actualizado@test.com",
  "direccion": "Nueva dirección del proveedor"
}
```

### 13.5 Eliminar Proveedor

```http
DELETE /suppliers/{id}
Authorization: Bearer {token}
```

---

## 14. GESTIÓN DE COMPRAS

### 14.1 Obtener Todas las Compras

```http
GET /purchases
Authorization: Bearer {token}
```

### 14.2 Obtener Compra por ID

```http
GET /purchases/{id}
Authorization: Bearer {token}
```

### 14.3 Crear Nueva Compra

```http
POST /purchases
Authorization: Bearer {token}
Content-Type: application/json

{
  "supplierId": 1,
  "total": 1000.00,
  "status": "pendiente",
  "details": [
    {
      "productId": 1,
      "quantity": 10,
      "unitPrice": 100.00
    }
  ]
}
```

### 14.4 Actualizar Compra

```http
PUT /purchases/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "supplierId": 1,
  "total": 1500.00,
  "status": "aprobada",
  "details": [
    {
      "productId": 1,
      "quantity": 15,
      "unitPrice": 100.00
    }
  ]
}
```

### 14.5 Eliminar Compra

```http
DELETE /purchases/{id}
Authorization: Bearer {token}
```

---

## 15. GESTIÓN DE PROYECTOS

Base URL: `{{baseUrl}}` (por defecto `http://localhost:3006/api`)

Headers comunes:

- Authorization: `Bearer {{token}}`
- Content-Type: `application/json` cuando aplique

### 15.1 Listar Proyectos

- GET `/projects`
- Query opcionales: `search`, `estado` (Pendiente|En Progreso|Completado|Cancelado), `prioridad` (Baja|Media|Alta), `page`, `limit`

Ejemplo:

```bash
GET {{baseUrl}}/projects
Authorization: Bearer {{token}}
```

Respuesta 200:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numeroContrato": "CT-2025-001",
      "nombre": "Instalación Sistema CCTV",
      "cliente": "Constructora XYZ",
      "responsable": { "nombre": "Daniela V.", "avatarSeed": "Daniela" },
      "fechaInicio": "2025-10-01",
      "fechaFin": "2025-11-15",
      "estado": "En Progreso",
      "progreso": 10,
      "prioridad": "Alta",
      "ubicacion": "Carrera 48 #20-115",
      "empleadosAsociados": [],
      "descripcion": null,
      "materiales": [],
      "servicios": [],
      "costos": { "manoDeObra": 0 },
      "observaciones": null,
      "sedes": []
    }
  ],
  "total": 1
}
```

### 15.2 Obtener Proyecto por ID

- GET `/projects/:id`

```bash
GET {{baseUrl}}/projects/1
Authorization: Bearer {{token}}
```

Respuesta 200: igual a un objeto del array anterior.

### 15.3 Crear Proyecto

- POST `/projects`

Body JSON mínimo:

```json
{
  "numero_contrato": "CT-2024-001",
  "nombre": "Instalación Sistema de Seguridad Empresa XYZ",
  "id_cliente": 1,
  "id_responsable": 1,
  "fecha_inicio": "2024-01-15",
  "fecha_fin": "2024-03-15",
  "estado": "Pendiente",
  "progreso": 0,
  "prioridad": "Alta",
  "ubicacion": "Carrera 15 # 45-67, Bogotá, Colombia",
  "descripcion": "Instalación completa de sistema de seguridad con cámaras, sensores y sistema de monitoreo 24/7 para la empresa XYZ",
  "observaciones": "Cliente requiere instalación en horario nocturno para no afectar operaciones diarias",
  "costo_mano_obra": 5000000,
  "materiales": [
    {
      "id_producto": 1,
      "cantidad": 10
    },
    {
      "id_producto": 2,
      "cantidad": 5
    }
  ],
  "servicios": [
    {
      "id_servicio": 1,
      "cantidad": 1
    },
    {
      "id_servicio": 2,
      "cantidad": 2
    }
  ],
  "empleadosAsociados": [
    {
      "id_usuario": 2
    },
    {
      "id_usuario": 3
    }
  ],
  "sedes": [
    {
      "id_direccion": 1,
      "nombre": "Sede Principal - Oficinas",
      "presupuesto_materiales": 3000000,
      "presupuesto_servicios": 1500000,
      "presupuesto_total": 4500000,
      "presupuesto_restante": 4500000,
      "materialesAsignados": [
        {
          "id_producto": 1,
          "cantidad": 6
        },
        {
          "id_producto": 2,
          "cantidad": 3
        }
      ],
      "serviciosAsignados": [
        {
          "id_servicio": 1,
          "cantidad": 1
        },
        {
          "id_servicio": 2,
          "cantidad": 1
        }
      ]
    },
    {
      "nombre": "Sede Secundaria - Manual",
      "ubicacion": "Dirección manual sin usar direcciones del cliente",
      "presupuesto_materiales": 2000000,
      "presupuesto_servicios": 1000000,
      "presupuesto_total": 3000000,
      "presupuesto_restante": 3000000,
      "materialesAsignados": [
        {
          "id_producto": 1,
          "cantidad": 4
        }
      ],
      "serviciosAsignados": [
        {
          "id_servicio": 2,
          "cantidad": 1
        }
      ]
    }
  ]
}
```

Respuesta 201:

```json
{
  "success": true,
  "message": "Proyecto creado exitosamente",
  "data": {
    /* Objeto proyecto transformado para frontend */
  }
}
```

### 15.4 Actualizar Proyecto

- PUT `/projects/:id`

Body JSON (parcial):

```json
{
  "nombre": "Proyecto Actualizado",
  "fecha_fin": "2025-12-01",
  "estado": "En Progreso",
  "progreso": 35,
  "prioridad": "Media",
  "observaciones": "Actualización de alcance"
}
```

Respuesta 200 similar a creación.

### 15.5 Eliminar Proyecto

- DELETE `/projects/:id`

Respuesta 200:

```json
{ "success": true, "message": "Proyecto eliminado exitosamente" }
```

### 15.6 Proyectos por Cliente

- GET `/projects/client/:clientId`

### 15.7 Proyectos por Responsable

- GET `/projects/responsible/:responsibleId`

### 15.8 Actualizar Progreso

- PATCH `/projects/:id/progress`

Body:

```json
{ "progreso": 60 }
```

### 15.9 Actualizar Estado

- PATCH `/projects/:id/status`

Body:

```json
{ "estado": "Completado" }
```

### 15.10 Registrar Salida de Material

- POST `/projects/salida-material`

Body:

```json
{
  "id_proyecto": 1,
  "id_proyecto_sede": 2,
  "id_producto": 10,
  "cantidad": 5,
  "id_entregador": 2,
  "receptor": "Juan Pérez",
  "observaciones": "Entrega inicial",
  "costo_total": 750000,
  "fecha_salida": "2025-09-15T10:30:00"
}
```

Respuesta 201:

```json
{
  "success": true,
  "message": "Salida de material registrada exitosamente",
  "salida": {
    "id_salida_material": 1,
    "id_proyecto": 1,
    "id_proyecto_sede": 2,
    "id_producto": 10,
    "cantidad": 5,
    "id_entregador": 2,
    "receptor": "Juan Pérez",
    "observaciones": "Entrega inicial",
    "costo_total": 750000,
    "fecha_salida": "2025-09-15T10:30:00"
  }
}
```

### 15.11 Listar Salidas de Material

- GET `/projects/:idProyecto/salidas-material`
- Query opcional: `idSede`

Respuesta 200:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "material": "Cámara IP Domo 4MP",
      "cantidad": 5,
      "entregador": "Nombre Apellido",
      "receptor": "Juan Pérez",
      "observaciones": "Entrega inicial",
      "costoTotal": 750000,
      "fecha": "2025-09-15T10:30:00",
      "sede": "Oficina Principal"
    }
  ],
  "total": 1
}
```

### 15.12 Estadísticas de Proyectos

- GET `/projects/stats`

Respuesta 200 (ejemplo):

```json
{
  "success": true,
  "data": {
    "total": 12,
    "activos": 4,
    "porEstado": [
      { "estado": "Pendiente", "count": 3 },
      { "estado": "En Progreso", "count": 4 },
      { "estado": "Completado", "count": 5 }
    ]
  }
}
```

### 15.13 Exportar Proyectos (JSON para Excel)

- GET `/projects/export`

Respuesta 200:

```json
{
  "success": true,
  "message": "Datos preparados para exportación",
  "data": [{ "Número de Contrato": "CT-2025-001", "Nombre": "..." }],
  "filename": "Reporte_Proyectos_2025-09-10.xlsx"
}
```

## 16. HEALTH CHECK

### 16.1 Verificar Estado de la API

```http
GET /health
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Conv3rTech API está funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## FLUJO DE PRUEBAS RECOMENDADO

1. **Verificar estado de la API** - `GET /health`
2. **Iniciar sesión como admin** - `POST /auth/login`
3. **Obtener perfil** - `GET /auth/profile`
4. **Ver permisos disponibles** - `GET /permissions`
5. **Ver privilegios disponibles** - `GET /privileges`
6. **Crear un nuevo rol** - `POST /roles`
7. **Asignar permisos al rol** - `POST /roles/{id}/permissions`
8. **Crear un nuevo usuario** - `POST /users`
9. **Probar funcionalidades de productos** - CRUD de productos
10. **Probar funcionalidades de clientes** - CRUD de clientes
11. **Probar funcionalidades de proveedores** - CRUD de proveedores
12. **Probar funcionalidades de compras** - CRUD de compras

---

## NOTAS IMPORTANTES

- **Autenticación**: Todas las rutas protegidas requieren el header `Authorization: Bearer {token}`
- **Permisos**: Algunas rutas requieren permisos específicos además de autenticación
- **Validaciones**: Los datos enviados deben cumplir con las validaciones del backend
- **IDs**: Reemplazar `{id}`, `{roleId}`, etc. con los IDs reales obtenidos de las respuestas
- **Tokens**: El token de acceso se obtiene al hacer login y debe incluirse en todas las peticiones protegidas
- **Token Regeneration**: Usar el endpoint `/auth/refresh` con el token actual para regenerar un nuevo token

## ⚠️ CAMBIOS EN NOMBRES DE CAMPOS

**Este documento ha sido actualizado para usar los nombres de campos correctos según los modelos de la base de datos:**

### Campos Corregidos:

- **Usuarios**: `name` → `nombre` + `apellido`, `email` → `correo`, `password` → `contrasena`
- **Roles**: `name` → `nombre_rol`, `description` → `descripcion`
- **Permisos**: `name` → `nombre_permiso`, `description` → `descripcion`
- **Privilegios**: `name` → `nombre_privilegio`, `description` → `descripcion`
- **Productos**: `name` → `nombre`, `description` → `modelo`, `price` → `precio`
- **Categorías**: `name` → `nombre`, `description` → `descripcion`
- **Características**: `name` → `nombre`
- **Clientes**: `name` → `nombre` + `apellido`, `email` → `correo`, `phone` → `telefono`
- **Proveedores**: `name` → `nombre_empresa`, `email` → `correo`, `phone` → `telefono`

### Estructura de Asignación de Permisos:

La asignación de permisos y privilegios a roles ahora usa la estructura correcta:

```json
{
  "permisos": [
    {
      "id_permiso": 1,
      "privilegios": [
        {
          "id_privilegio": 1
        }
      ]
    }
  ]
}
```

---

## CÓDIGOS DE RESPUESTA

- `200` - Operación exitosa
- `201` - Recurso creado exitosamente
- `400` - Error de validación o datos incorrectos
- `401` - No autenticado
- `403` - No autorizado (sin permisos)
- `404` - Recurso no encontrado
- `500` - Error interno del servidor


## 17. GESTIÓN DE PAGOS DE PROYECTOS

Base de rutas para pagos anidados bajo proyectos. Debes montar el router de pagos bajo el prefijo /api/projects en tu servidor:
- Ejemplo de montaje: app.use('/api/projects', paymentsInstallmentsRoutes)

Reglas de negocio clave:
- Si el cliente del proyecto tiene credito = false:
  - Solo se permite UN único pago aprobado.
  - El monto debe ser exactamente igual al saldo pendiente.
  - Se rechazan pagos parciales y un segundo pago con 409 y código payments.single_payment_required.
- Si el cliente del proyecto tiene credito = true:
  - Se permiten múltiples pagos parciales mientras la suma no exceda el total del proyecto.
  - Si el pago excede el saldo, 409 con código payments.over_total.
- Si el proyecto ya está liquidado (pendiente = 0):
  - Rechazar nuevos pagos con 409 y código payments.already_settled.
- El saldo pendiente siempre se calcula con base en pagos aprobados (estado=true).

Headers comunes:
- Authorization: Bearer {{token}}
- Content-Type: application/json
- Idempotency-Key: {{uuid}} (opcional en esta versión; reservado para control de reintentos)

Modelo de datos de pago (persistido en tabla pagos_abonos):
- id_pago_abono (PK autoincrement)
- id_proyecto (FK)
- fecha (Date, default NOW)
- monto (Decimal(10,2))
- metodo_pago (Efectivo | Transferencia | Tarjeta | Cheque)
- estado (Boolean, true=aprobado/activo; false=anulado)

Estructura de respuesta unificada:
- Éxito: { "data": ..., "meta": { ... } }
- Error: { "error": { "code": "payments.rule_violation", "message": "..." } }

Códigos de error internos típicos:
- payments.rule_violation
- payments.over_total
- payments.single_payment_required
- payments.already_settled
- payments.not_found

### 17.1 Crear pago para un proyecto
POST /projects/:projectId/payments

Headers:
- Authorization: Bearer {{token}}
- Content-Type: application/json
- Idempotency-Key: 3f6d6d8e-1e7b-4a9f-9a7c-1f2a9a0a9a7c (opcional)

Body:
{
  "monto": 250000.00,
  "metodo_pago": "Transferencia",
  "fecha": "2025-09-18T10:30:00" // opcional
}

Respuesta 201:
{
  "data": {
    "id_pago_abono": 12,
    "id_proyecto": 3,
    "fecha": "2025-09-18T10:30:00.000Z",
    "monto": 250000.00,
    "metodo_pago": "Transferencia",
    "estado": true
  },
  "meta": { "message": "Pago creado" }
}

Posibles 409 (conflicto):
- Cliente sin crédito intentando pago parcial o segundo pago:
  { "error": { "code": "payments.single_payment_required", "message": "El monto debe ser exactamente igual al saldo pendiente" } }
- Monto excede el saldo pendiente:
  { "error": { "code": "payments.over_total", "message": "El monto excede el total pendiente" } }
- Proyecto ya liquidado:
  { "error": { "code": "payments.already_settled", "message": "Proyecto ya liquidado" } }

### 17.2 Listar pagos de un proyecto
GET /projects/:projectId/payments

Respuesta 200:
{
  "data": [
    { "id_pago_abono": 10, "id_proyecto": 3, "fecha": "2025-09-10T12:00:00.000Z", "monto": 150000.00, "metodo_pago": "Efectivo", "estado": true },
    { "id_pago_abono": 8, "id_proyecto": 3, "fecha": "2025-09-01T09:00:00.000Z", "monto": 100000.00, "metodo_pago": "Tarjeta", "estado": false }
  ],
  "meta": { "total": 2 }
}

### 17.3 Obtener un pago específico del proyecto
GET /projects/:projectId/payments/:paymentId

Respuesta 200:
{
  "data": {
    "id_pago_abono": 10,
    "id_proyecto": 3,
    "fecha": "2025-09-10T12:00:00.000Z",
    "monto": 150000.00,
    "metodo_pago": "Efectivo",
    "estado": true
  },
  "meta": {}
}

Respuesta 404:
{ "error": { "code": "payments.not_found", "message": "Pago no encontrado" } }

### 17.4 Actualizar un pago
No soportado por reglas del negocio. No se permite modificar pagos existentes; solo se admite crear, listar, buscar, obtener por id, obtener por proyecto y cancelar (anular).

### 17.5 Anular (cancelar) un pago del proyecto
DELETE /projects/:projectId/payments/:paymentId

Descripción:
- Anula un pago aprobándolo en estado=false (soft cancel). Si ya está anulado o no existe, se responde acorde.

Respuesta 204:
Sin cuerpo.

Errores comunes:
- 404 cuando el pago no existe o no pertenece al proyecto:
  { "error": { "code": "payments.not_found", "message": "Pago no encontrado" } }
- 409 cuando ya estaba anulado:
  { "error": { "code": "payments.rule_violation", "message": "El pago/abono ya fue anulado o no existe" } }

### 17.6 Notas de cálculo de saldo pendiente
- El pendiente se calcula como: costo_total_proyecto - SUM(monto) de pagos con estado=true.
- Cambios de estado afectarán el saldo pendiente de forma inmediata.
- La validación de reglas se realiza de forma transaccional para evitar condiciones de carrera.

### 17.7 Endpoints legacy (compatibilidad)
También se mantienen endpoints legacy bajo el router de payments_installments:
- POST /payments-installments
- GET /payments-installments
- GET /payments-installments/buscar/:term
- GET /payments-installments/:id
- PATCH /payments-installments/:id/cancelar

Estos endpoints aceptan "monto" o "monto_pagado" en POST por compatibilidad; se recomienda migrar a las rutas anidadas de proyectos.
