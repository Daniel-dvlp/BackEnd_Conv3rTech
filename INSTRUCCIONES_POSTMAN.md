# 📋 Instrucciones para usar la Colección de Postman - Conv3rTech

## 🚀 Configuración Inicial

### 1. Importar la Colección

1. Abre Postman
2. Haz clic en "Import"
3. Selecciona el archivo `Conv3rTech_Complete_API_Collection.json`
4. La colección se importará con todas las carpetas organizadas

### 2. Configurar Variables

La colección ya viene con las variables configuradas:

- **base_url**: `http://localhost:3006/api` (según API_TEST.md)
- **auth_token**: Se llena automáticamente después del login
- Todas las demás variables se llenan automáticamente cuando creas entidades

## 📁 Estructura de la Colección

### 🏥 Health Check

- **API Health Check**: Verifica que la API esté funcionando

### 🔐 Authentication

- **Login**: Inicia sesión y obtiene token automáticamente
- **Refresh Token**: Renueva el token actual
- **Get Profile**: Obtiene perfil del usuario autenticado
- **Update Profile**: Actualiza perfil del usuario
- **Change Password**: Cambia contraseña del usuario
- **Get Permissions**: Obtiene permisos del usuario
- **Logout**: Cierra sesión

### 👥 Roles Management

- **Get All Roles**: Lista todos los roles
- **Get Role by ID**: Obtiene rol específico
- **Create Role**: Crea nuevo rol (guarda ID automáticamente)
- **Update Role**: Actualiza rol existente
- **Delete Role**: Elimina rol
- **Get Roles with Permissions**: Obtiene roles con sus permisos
- **Get Permissions Summary**: Resumen de permisos

### 🔑 Permissions Management

- **Get All Permissions**: Lista todos los permisos
- **Get Permission by ID**: Obtiene permiso específico
- **Create Permission**: Crea nuevo permiso (guarda ID automáticamente)
- **Update Permission**: Actualiza permiso existente
- **Delete Permission**: Elimina permiso

### ⭐ Privileges Management

- **Get All Privileges**: Lista todos los privilegios
- **Get Privilege by ID**: Obtiene privilegio específico
- **Create Privilege**: Crea nuevo privilegio (guarda ID automáticamente)
- **Update Privilege**: Actualiza privilegio existente
- **Delete Privilege**: Elimina privilegio

### 🔗 Role-Permission Assignment

- **Assign Permission to Role**: Asigna permiso a rol
- **Get Role Permissions**: Obtiene permisos de un rol
- **Remove Permission from Role**: Remueve permiso de rol
- **Bulk Assign Permissions**: Asigna múltiples permisos

### 👤 Users Management

- **Get All Users**: Lista todos los usuarios
- **Get User by ID**: Obtiene usuario específico
- **Create User**: Crea nuevo usuario (guarda ID automáticamente)
- **Update User**: Actualiza usuario existente
- **Delete User**: Elimina usuario
- **Get My Profile**: Obtiene mi perfil
- **Update My Profile**: Actualiza mi perfil
- **Change My Password**: Cambia mi contraseña

### 📦 Products Management

- **Get All Products**: Lista todos los productos
- **Get Product by ID**: Obtiene producto específico
- **Create Product**: Crea nuevo producto (guarda ID automáticamente)
- **Update Product**: Actualiza producto existente
- **Delete Product**: Elimina producto
- **Change Product Status**: Cambia estado del producto

### 🏷️ Product Categories

- **Get All Categories**: Lista todas las categorías
- **Get Category by ID**: Obtiene categoría específica
- **Create Category**: Crea nueva categoría (guarda ID automáticamente)
- **Update Category**: Actualiza categoría existente
- **Delete Category**: Elimina categoría

### 🔧 Product Features

- **Get All Features**: Lista todas las características
- **Get Feature by ID**: Obtiene característica específica
- **Create Feature**: Crea nueva característica (guarda ID automáticamente)
- **Update Feature**: Actualiza característica existente
- **Delete Feature**: Elimina característica

### 📄 Datasheets

- **Get All Datasheets**: Lista todas las hojas técnicas
- **Get Datasheet by ID**: Obtiene hoja técnica específica
- **Create Datasheet**: Crea nueva hoja técnica (guarda ID automáticamente)
- **Update Datasheet**: Actualiza hoja técnica existente
- **Delete Datasheet**: Elimina hoja técnica

### 🏢 Clients Management

- **Get All Clients**: Lista todos los clientes
- **Get Client by ID**: Obtiene cliente específico
- **Create Client**: Crea nuevo cliente (guarda ID automáticamente)
- **Update Client**: Actualiza cliente existente
- **Delete Client**: Elimina cliente

### 📍 Client Addresses

- **Get All Addresses**: Lista todas las direcciones
- **Get Address by ID**: Obtiene dirección específica
- **Create Address**: Crea nueva dirección
- **Update Address**: Actualiza dirección existente
- **Delete Address**: Elimina dirección
- **Get Client Addresses**: Obtiene direcciones de un cliente

### 🏭 Suppliers Management

- **Get All Suppliers**: Lista todos los proveedores
- **Get Supplier by ID**: Obtiene proveedor específico
- **Create Supplier**: Crea nuevo proveedor (guarda ID automáticamente)
- **Update Supplier**: Actualiza proveedor existente
- **Delete Supplier**: Elimina proveedor

### 🛒 Purchases Management

- **Get All Purchases**: Lista todas las compras
- **Get Purchase by ID**: Obtiene compra específica
- **Create Purchase**: Crea nueva compra (guarda ID automáticamente)
- **Update Purchase**: Actualiza compra existente
- **Delete Purchase**: Elimina compra

### 🔧 Service Categories

- **Get All Service Categories**: Lista todas las categorías de servicios
- **Get Service Category by ID**: Obtiene categoría de servicio específica
- **Create Service Category**: Crea nueva categoría de servicio (guarda ID automáticamente)
- **Update Service Category**: Actualiza categoría de servicio existente
- **Delete Service Category**: Elimina categoría de servicio

### ⚙️ Services Management

- **Get All Services**: Lista todos los servicios
- **Get Service by ID**: Obtiene servicio específico
- **Create Service**: Crea nuevo servicio (guarda ID automáticamente)
- **Update Service**: Actualiza servicio existente
- **Delete Service**: Elimina servicio

### 🏗️ Projects Management (COMPLETO)

- **Get All Projects**: Lista todos los proyectos
- **Get Project by ID**: Obtiene proyecto específico con todas sus relaciones
- **Create Project**: Crea proyecto completo con materiales, servicios, empleados y sedes
- **Update Project**: Actualiza proyecto existente
- **Delete Project**: Elimina proyecto
- **Update Project Status**: Actualiza estado del proyecto
- **Update Project Progress**: Actualiza progreso del proyecto
- **Get Projects by Client**: Obtiene proyectos de un cliente
- **Get Projects by Responsible**: Obtiene proyectos de un responsable
- **Get Project Stats**: Obtiene estadísticas de proyectos
- **Export Projects**: Exporta proyectos a Excel

### 📤 Material Outputs

- **Create Material Output**: Registra salida de material
- **Get Material Outputs**: Lista salidas de material de un proyecto

### ✅ Service Management

- **Mark Service as Completed**: Marca servicio como completado
- **Mark Service as Pending**: Marca servicio como pendiente

## 🔄 Flujo de Pruebas Recomendado

### 1. Configuración Inicial

```
1. Health Check
2. Login (esto llena automáticamente el auth_token)
3. Get Profile
```

### 2. Configuración de Roles y Permisos

```
4. Get All Permissions
5. Get All Privileges
6. Create Permission
7. Create Privilege
8. Create Role
9. Assign Permission to Role
```

### 3. Gestión de Usuarios

```
10. Create User
11. Get All Users
```

### 4. Configuración de Productos

```
12. Create Product Category
13. Create Product
14. Create Feature
15. Create Datasheet
```

### 5. Gestión de Clientes

```
16. Create Client
17. Create Client Address
```

### 6. Configuración de Servicios

```
17. Create Service Category
18. Create Service
```

### 7. Gestión de Proveedores y Compras

```
19. Create Supplier
20. Create Purchase
```

### 8. Gestión de Proyectos (MÓDULO PRINCIPAL)

```
21. Create Project (con todos los datos completos)
22. Get Project by ID
23. Update Project Status
24. Update Project Progress
25. Create Material Output
26. Get Project Stats
27. Export Projects
```

## 🎯 Datos de Ejemplo Incluidos

### Usuario Admin por Defecto

```json
{
  "correo": "admin@conv3rtech.com",
  "contrasena": "admin123"
}
```

### Ejemplos de Datos de Prueba

- **Cliente**: Empresa ABC S.A.S con NIT
- **Producto**: Cable UTP Cat6 305m
- **Servicio**: Instalación de Cableado Estructurado
- **Proyecto**: Instalación Red Corporativa Empresa ABC
- **Responsable**: Juan Pérez (usuario técnico)

## 🔧 Variables Automáticas

La colección maneja automáticamente estas variables:

- `auth_token` - Token de autenticación
- `user_id` - ID del usuario creado
- `role_id` - ID del rol creado
- `permission_id` - ID del permiso creado
- `privilege_id` - ID del privilegio creado
- `product_id` - ID del producto creado
- `product_category_id` - ID de categoría de producto
- `feature_id` - ID de característica creada
- `datasheet_id` - ID de hoja técnica creada
- `client_id` - ID del cliente creado
- `address_id` - ID de dirección creada
- `supplier_id` - ID del proveedor creado
- `purchase_id` - ID de compra creada
- `service_category_id` - ID de categoría de servicio
- `service_id` - ID del servicio creado
- `project_id` - ID del proyecto creado
- `project_sede_id` - ID de sede del proyecto

## ⚠️ Notas Importantes

1. **Autenticación**: Todas las rutas protegidas requieren el header `Authorization: Bearer {token}`
2. **Orden de Ejecución**: Ejecuta las requests en el orden recomendado para evitar errores de dependencias
3. **IDs Automáticos**: Los IDs se guardan automáticamente después de crear entidades
4. **Base URL**: Asegúrate de que el servidor esté corriendo en `http://localhost:3006`
5. **Validaciones**: Los datos enviados deben cumplir con las validaciones del backend

## 🚨 Solución de Problemas

### Error 401 (Unauthorized)

- Verifica que hayas hecho login y que el token esté guardado
- Ejecuta "Login" primero

### Error 400 (Bad Request)

- Verifica que los datos del body cumplan con las validaciones
- Revisa que las variables como `{{product_category_id}}` estén llenas

### Error 404 (Not Found)

- Verifica que el ID que estás usando existe
- Asegúrate de haber creado la entidad antes de usarla

### Error 500 (Internal Server Error)

- Verifica que el servidor esté corriendo
- Revisa los logs del servidor

## 📊 Funcionalidades del Módulo de Proyectos

La colección incluye **TODAS** las funcionalidades del módulo de proyectos:

✅ **CRUD Completo de Proyectos**
✅ **Gestión de Estados** (Pendiente → En Progreso → Completado → Cancelado)
✅ **Control de Progreso** (0-100%)
✅ **Asignación de Materiales y Servicios**
✅ **Gestión de Empleados del Proyecto**
✅ **Control de Salidas de Material**
✅ **Estadísticas y Reportes**
✅ **Exportación a Excel**
✅ **Filtros por Cliente/Responsable**
✅ **Gestión de Sedes del Proyecto**

¡La colección está lista para probar completamente todos los módulos de Conv3rTech! 🎉

