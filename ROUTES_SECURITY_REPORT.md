# Reporte de Seguridad de Rutas - Conv3rTech Backend

## ✅ RUTAS PÚBLICAS (Sin Autenticación)

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/health` - Health check

## 🔒 RUTAS PROTEGIDAS (Requieren Autenticación)

### Autenticación

- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/permissions` - Obtener permisos del usuario

### Usuarios

- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/users/profile/me` - Obtener mi perfil
- `PUT /api/users/profile/me` - Actualizar mi perfil
- `PUT /api/users/profile/change-password` - Cambiar mi contraseña

### Roles y Permisos (Solo Administradores)

- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `GET /api/roles/:id` - Obtener rol por ID
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol
- `POST /api/roles/:id/permissions` - Asignar permisos a rol
- `GET /api/roles/:id/permissions` - Obtener permisos del rol
- `GET /api/roles/permissions/available` - Obtener permisos disponibles
- `GET /api/roles/privileges/available` - Obtener privilegios disponibles

### Permisos (Solo Administradores)

- `GET /api/permissions` - Listar permisos
- `POST /api/permissions` - Crear permiso
- `GET /api/permissions/:id` - Obtener permiso por ID
- `PUT /api/permissions/:id` - Actualizar permiso
- `DELETE /api/permissions/:id` - Eliminar permiso

### Privilegios (Solo Administradores)

- `GET /api/privileges` - Listar privilegios
- `POST /api/privileges` - Crear privilegio
- `GET /api/privileges/:id` - Obtener privilegio por ID
- `PUT /api/privileges/:id` - Actualizar privilegio
- `DELETE /api/privileges/:id` - Eliminar privilegio

### Clientes

- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Obtener cliente por ID
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente
- `GET /api/clients/search/:term` - Buscar clientes
- `PUT /api/clients/:id/credit` - Cambiar crédito del cliente
- `PUT /api/clients/:id/status` - Cambiar estado del cliente

### Direcciones de Clientes

- `GET /api/address-clients` - Listar direcciones
- `POST /api/address-clients` - Crear dirección
- `PUT /api/address-clients/:id` - Actualizar dirección
- `DELETE /api/address-clients/:id` - Eliminar dirección

### Productos

- `GET /api/products/products` - Listar productos
- `POST /api/products/products` - Crear producto
- `GET /api/products/products/:id` - Obtener producto por ID
- `PUT /api/products/products/:id` - Actualizar producto
- `DELETE /api/products/products/:id` - Eliminar producto
- `PATCH /api/products/products/:id/estado` - Cambiar estado del producto

### Características de Productos

- `GET /api/products/features` - Listar características
- `POST /api/products/features` - Crear característica
- `GET /api/products/features/:id` - Obtener característica por ID
- `PUT /api/products/features/:id` - Actualizar característica
- `DELETE /api/products/features/:id` - Eliminar característica

### Hojas Técnicas de Productos

- `GET /api/products/datasheets` - Listar hojas técnicas
- `POST /api/products/datasheets` - Crear hoja técnica
- `GET /api/products/datasheets/:id` - Obtener hoja técnica por ID
- `PUT /api/products/datasheets/:id` - Actualizar hoja técnica
- `DELETE /api/products/datasheets/:id` - Eliminar hoja técnica

### Categorías de Productos

- `GET /api/productsCategory` - Listar categorías
- `POST /api/productsCategory` - Crear categoría
- `GET /api/productsCategory/:id` - Obtener categoría por ID
- `PUT /api/productsCategory/:id` - Actualizar categoría
- `DELETE /api/productsCategory/:id` - Eliminar categoría
- `PATCH /api/productsCategory/:id` - Cambiar estado de categoría

### Proveedores

- `GET /api/suppliers` - Listar proveedores
- `POST /api/suppliers` - Crear proveedor
- `GET /api/suppliers/:id` - Obtener proveedor por ID
- `PUT /api/suppliers/:id` - Actualizar proveedor
- `DELETE /api/suppliers/:id` - Eliminar proveedor
- `PATCH /api/suppliers/:id/state` - Cambiar estado del proveedor

### Compras

- `GET /api/purchases` - Listar compras
- `POST /api/purchases` - Crear compra
- `GET /api/purchases/:id` - Obtener compra por ID
- `PUT /api/purchases/:id` - Actualizar compra
- `DELETE /api/purchases/:id` - Eliminar compra
- `PATCH /api/purchases/state/:id` - Cambiar estado de compra

### Ventas de Productos

- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Crear venta
- `GET /api/sales/:id` - Obtener venta por ID
- `PUT /api/sales/:id` - Actualizar venta
- `DELETE /api/sales/:id` - Eliminar venta
- `PATCH /api/sales/:id/estado` - Cambiar estado de venta

### Detalles de Ventas

- `GET /api/sales/details` - Listar detalles de ventas
- `POST /api/sales/details` - Crear detalle de venta
- `GET /api/sales/details/:id` - Obtener detalle por ID
- `PUT /api/sales/details/:id` - Actualizar detalle
- `DELETE /api/sales/details/:id` - Eliminar detalle

### Cotizaciones

- `GET /api/quotes` - Listar cotizaciones
- `POST /api/quotes` - Crear cotización
- `GET /api/quotes/:id` - Obtener cotización por ID
- `PUT /api/quotes/:id` - Actualizar cotización
- `DELETE /api/quotes/:id` - Eliminar cotización
- `PATCH /api/quotes/:id/estado` - Cambiar estado de cotización
- `GET /api/quotes/:id/detalles` - Obtener detalles de cotización

### Detalles de Cotizaciones

- `GET /api/quotes/details` - Listar detalles de cotizaciones
- `POST /api/quotes/details` - Crear detalle de cotización
- `GET /api/quotes/details/:id` - Obtener detalle por ID
- `PUT /api/quotes/details/:id` - Actualizar detalle
- `DELETE /api/quotes/details/:id` - Eliminar detalle
- `GET /api/quotes/details/cotizacion/:id` - Obtener detalles por cotización

### Proyectos

- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto por ID
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto
- `GET /api/projects/search` - Búsqueda rápida de proyectos
- `GET /api/projects/stats` - Estadísticas de proyectos
- `GET /api/projects/export` - Exportar proyectos
- `GET /api/projects/:id/outstanding` - Saldo pendiente del proyecto
- `PATCH /api/projects/:id/progress` - Actualizar progreso
- `PATCH /api/projects/:id/status` - Actualizar estado
- `GET /api/projects/client/:clientId` - Proyectos por cliente
- `GET /api/projects/responsible/:responsibleId` - Proyectos por responsable
- `POST /api/projects/salida-material` - Crear salida de material
- `GET /api/projects/:idProyecto/salidas-material` - Obtener salidas de material
- `PATCH /api/projects/servicios/:idSedeServicio/completar` - Marcar servicio como completado
- `PATCH /api/projects/servicios/:idSedeServicio/pendiente` - Marcar servicio como pendiente

### Pagos de Proyectos

- `POST /api/projects/:projectId/payments` - Crear pago para proyecto
- `GET /api/projects/:projectId/payments` - Listar pagos del proyecto
- `GET /api/projects/:projectId/payments/:paymentId` - Obtener pago específico
- `DELETE /api/projects/:projectId/payments/:paymentId` - Eliminar pago

### Servicios

- `GET /api/services` - Listar servicios
- `POST /api/services` - Crear servicio
- `GET /api/services/:id` - Obtener servicio por ID
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

### Categorías de Servicios

- `GET /api/service-categories` - Listar categorías de servicios
- `POST /api/service-categories` - Crear categoría
- `GET /api/service-categories/:id` - Obtener categoría por ID
- `PUT /api/service-categories/:id` - Actualizar categoría
- `DELETE /api/service-categories/:id` - Eliminar categoría

### Programación Laboral

- `GET /api/labor-scheduling` - Listar programaciones
- `POST /api/labor-scheduling` - Crear programación
- `GET /api/labor-scheduling/:id` - Obtener programación por ID
- `PUT /api/labor-scheduling/:id` - Actualizar programación
- `DELETE /api/labor-scheduling/:id` - Eliminar programación

### Pagos e Instalmentos (Legacy)

- `GET /api/payments-installments` - Listar pagos/abonos
- `POST /api/payments-installments` - Crear pago/abono
- `GET /api/payments-installments/buscar/:term` - Buscar pagos/abonos
- `GET /api/payments-installments/:id` - Obtener pago/abono por ID
- `PATCH /api/payments-installments/:id/cancelar` - Anular pago/abono

### Citas

- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `GET /api/appointments/:id` - Obtener cita por ID
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Upload de Archivos

- `POST /api/upload` - Subir imagen (requiere autenticación)

## 🔐 MIDDLEWARE DE SEGURIDAD

### AuthMiddleware

- Verifica token JWT en header `Authorization: Bearer <token>`
- Valida que el token no esté expirado
- Añade información del usuario a `req.user`

### AdminMiddleware

- Requiere que el usuario sea administrador (id_rol = 1)
- Se aplica a rutas de roles, permisos y privilegios

### RoleMiddleware

- Verifica que el usuario tenga uno de los roles permitidos

### PermissionMiddleware

- Verifica permisos específicos por módulo y privilegio

## ✅ ESTADO DE SEGURIDAD

**TODAS LAS RUTAS ESTÁN CORRECTAMENTE PROTEGIDAS**

- ✅ Rutas públicas limitadas solo a login, refresh y health check
- ✅ Todas las rutas de negocio requieren autenticación
- ✅ Rutas administrativas requieren rol de administrador
- ✅ Middleware de autenticación aplicado consistentemente
- ✅ Token JWT manejado correctamente
- ✅ Interceptors de Axios configurados en frontend
- ✅ Protección de rutas en frontend implementada

## 🚀 DESPLIEGUE EN RENDER

### Variables de Entorno Requeridas:

```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tu-frontend.onrender.com
```

### Comandos de Build:

- Build Command: `npm install`
- Start Command: `npm start`
