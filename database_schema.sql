-- Script SQL generado automáticamente
-- Fecha: 28/10/2025, 7:52:02 p.m.
-- Base de datos: MySQL/MariaDB

SET FOREIGN_KEY_CHECKS = 0;

-- Tabla: roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_rol` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre_rol` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` TEXT,
  `estado` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: permisos
DROP TABLE IF EXISTS `permisos`;
CREATE TABLE `permisos` (
  `id_permiso` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre_permiso` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT,
  `estado` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: privilegios
DROP TABLE IF EXISTS `privilegios`;
CREATE TABLE `privilegios` (
  `id_privilegio` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre_privilegio` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` TEXT,
  `estado` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: permiso_privilegio
DROP TABLE IF EXISTS `permiso_privilegio`;
CREATE TABLE `permiso_privilegio` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_permiso` INTEGER NOT NULL,
  `id_privilegio` INTEGER NOT NULL,
  CONSTRAINT `fk_permiso_privilegio_id_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permisos`(`id_permiso`),
  CONSTRAINT `fk_permiso_privilegio_id_privilegio` FOREIGN KEY (`id_privilegio`) REFERENCES `privilegios`(`id_privilegio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: rol_privilegio
DROP TABLE IF EXISTS `rol_privilegio`;
CREATE TABLE `rol_privilegio` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_rol` INTEGER NOT NULL,
  `id_privilegio` INTEGER NOT NULL,
  CONSTRAINT `fk_rol_privilegio_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`),
  CONSTRAINT `fk_rol_privilegio_id_privilegio` FOREIGN KEY (`id_privilegio`) REFERENCES `privilegios`(`id_privilegio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `documento` VARCHAR(15) NOT NULL UNIQUE,
  `tipo_documento` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `celular` VARCHAR(15) NOT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `id_rol` INTEGER NOT NULL,
  `estado_usuario` VARCHAR(255) NOT NULL,
  `fecha_creacion` DATETIME,
  CONSTRAINT `fk_usuarios_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: clientes
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id_cliente` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `documento` VARCHAR(15) NOT NULL UNIQUE,
  `tipo_documento` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50),
  `telefono` VARCHAR(15) NOT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `credito` TINYINT(1) DEFAULT 0,
  `estado_cliente` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: direcciones_clientes
DROP TABLE IF EXISTS `direcciones_clientes`;
CREATE TABLE `direcciones_clientes` (
  `id_direccion` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_cliente` INTEGER NOT NULL,
  `nombre_direccion` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  CONSTRAINT `fk_direcciones_clientes_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: proveedores
DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE `proveedores` (
  `id_proveedor` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nit` VARCHAR(15) NOT NULL UNIQUE,
  `nombre_encargado` VARCHAR(50) NOT NULL,
  `nombre_empresa` VARCHAR(50) NOT NULL UNIQUE,
  `telefono` VARCHAR(15) NOT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `direccion` VARCHAR(255) NOT NULL,
  `estado` TINYINT(1) DEFAULT 1,
  `fecha_registro` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: categoria_productos
DROP TABLE IF EXISTS `categoria_productos`;
CREATE TABLE `categoria_productos` (
  `id_categoria` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` VARCHAR(250),
  `estado` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: productos
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id_producto` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `fotos` JSON,
  `nombre` VARCHAR(255) NOT NULL,
  `modelo` VARCHAR(100) NOT NULL,
  `id_categoria` INTEGER NOT NULL,
  `unidad_medida` VARCHAR(255) DEFAULT 'unidad',
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INTEGER DEFAULT 0,
  `garantia` INTEGER NOT NULL,
  `codigo_barra` VARCHAR(100),
  `estado` TINYINT(1) DEFAULT 1,
  CONSTRAINT `fk_productos_id_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_productos`(`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: caracteristicas_productos
DROP TABLE IF EXISTS `caracteristicas_productos`;
CREATE TABLE `caracteristicas_productos` (
  `id_caracteristica` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: fichas_tecnicas
DROP TABLE IF EXISTS `fichas_tecnicas`;
CREATE TABLE `fichas_tecnicas` (
  `id_ficha_tecnica` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_producto` INTEGER NOT NULL,
  `id_caracteristica` INTEGER NOT NULL,
  `valor` VARCHAR(255) NOT NULL,
  CONSTRAINT `fk_fichas_tecnicas_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
  CONSTRAINT `fk_fichas_tecnicas_id_caracteristica` FOREIGN KEY (`id_caracteristica`) REFERENCES `caracteristicas_productos`(`id_caracteristica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: categorias_servicios
DROP TABLE IF EXISTS `categorias_servicios`;
CREATE TABLE `categorias_servicios` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `url_imagen` VARCHAR(250) NOT NULL,
  `nombre` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` VARCHAR(250) NOT NULL,
  `estado` VARCHAR(10) NOT NULL DEFAULT 'activo',
  `fecha_creacion` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: servicios
DROP TABLE IF EXISTS `servicios`;
CREATE TABLE `servicios` (
  `id_servicio` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(250) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `url_imagen` VARCHAR(250),
  `estado` VARCHAR(10) NOT NULL DEFAULT 'activo',
  `fecha_creacion` DATETIME,
  `id_categoria_servicio` INTEGER NOT NULL,
  CONSTRAINT `fk_servicios_id_categoria_servicio` FOREIGN KEY (`id_categoria_servicio`) REFERENCES `categorias_servicios`(`id_categoria_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: compras
DROP TABLE IF EXISTS `compras`;
CREATE TABLE `compras` (
  `id_compra` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `numero_recibo` VARCHAR(20) NOT NULL UNIQUE,
  `id_proveedor` INTEGER NOT NULL UNIQUE,
  `monto` DECIMAL(10,2) NOT NULL,
  `fecha_registro` DATETIME,
  `estado` VARCHAR(255) DEFAULT 'Registrada',
  `fecha_recibo` DATETIME NOT NULL,
  `iva` DECIMAL(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: detalles_compras
DROP TABLE IF EXISTS `detalles_compras`;
CREATE TABLE `detalles_compras` (
  `id_detalle_compra` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_compra` INTEGER NOT NULL,
  `id_producto` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal_producto` DECIMAL(10,2) NOT NULL,
  `fecha_registro` DATETIME,
  CONSTRAINT `fk_detalles_compras_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: venta_productos
DROP TABLE IF EXISTS `venta_productos`;
CREATE TABLE `venta_productos` (
  `id_venta` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `numero_venta` VARCHAR(20) NOT NULL UNIQUE,
  `id_cliente` INTEGER NOT NULL,
  `fecha_venta` DATETIME NOT NULL,
  `fecha_registro` DATETIME,
  `metodo_pago` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(255) DEFAULT 'Registrada',
  `subtotal_venta` DECIMAL(15,2) NOT NULL,
  `monto_iva` DECIMAL(15,2) NOT NULL,
  `monto_venta` DECIMAL(15,2) NOT NULL,
  CONSTRAINT `fk_venta_productos_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: detalle_venta_productos
DROP TABLE IF EXISTS `detalle_venta_productos`;
CREATE TABLE `detalle_venta_productos` (
  `id_detalle` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_venta` INTEGER NOT NULL,
  `id_producto` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL,
  `precio_unitario` DECIMAL(15,2) NOT NULL,
  `subtotal_producto` DECIMAL(15,2) NOT NULL,
  CONSTRAINT `fk_detalle_venta_productos_id_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta_productos`(`id_venta`),
  CONSTRAINT `fk_detalle_venta_productos_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: cotizaciones
DROP TABLE IF EXISTS `cotizaciones`;
CREATE TABLE `cotizaciones` (
  `id_cotizacion` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `nombre_cotizacion` VARCHAR(50) NOT NULL,
  `id_cliente` INTEGER NOT NULL,
  `fecha_creacion` DATE,
  `fecha_vencimiento` DATE NOT NULL,
  `subtotal_productos` DECIMAL(10,2) DEFAULT 0,
  `subtotal_servicios` DECIMAL(10,2) DEFAULT 0,
  `monto_iva` DECIMAL(10,2) DEFAULT 0,
  `monto_cotizacion` DECIMAL(10,2) DEFAULT 0,
  `observaciones` TEXT,
  `estado` VARCHAR(255) NOT NULL DEFAULT 'Pendiente',
  CONSTRAINT `fk_cotizaciones_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: detalles_cotizacion
DROP TABLE IF EXISTS `detalles_cotizacion`;
CREATE TABLE `detalles_cotizacion` (
  `id_detalle_cot` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_cotizacion` INTEGER NOT NULL,
  `id_producto` INTEGER,
  `id_servicio` INTEGER,
  `cantidad` INTEGER NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  CONSTRAINT `fk_detalles_cotizacion_id_cotizacion` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones`(`id_cotizacion`),
  CONSTRAINT `fk_detalles_cotizacion_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
  CONSTRAINT `fk_detalles_cotizacion_id_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: proyectos
DROP TABLE IF EXISTS `proyectos`;
CREATE TABLE `proyectos` (
  `id_proyecto` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `numero_contrato` VARCHAR(50) NOT NULL UNIQUE,
  `nombre` VARCHAR(200) NOT NULL,
  `id_cliente` INTEGER NOT NULL,
  `id_cotizacion` INTEGER UNIQUE,
  `id_responsable` INTEGER,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` VARCHAR(255) NOT NULL DEFAULT 'Pendiente',
  `progreso` INTEGER NOT NULL DEFAULT 0,
  `prioridad` VARCHAR(255) NOT NULL DEFAULT 'Media',
  `ubicacion` TEXT,
  `descripcion` TEXT,
  `observaciones` TEXT,
  `costo_mano_obra` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `costo_total_materiales` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `costo_total_servicios` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `costo_total_proyecto` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `fecha_creacion` DATETIME,
  `fecha_actualizacion` DATETIME,
  CONSTRAINT `fk_proyectos_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`),
  CONSTRAINT `fk_proyectos_id_cotizacion` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones`(`id_cotizacion`),
  CONSTRAINT `fk_proyectos_id_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios`(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: proyecto_empleados
DROP TABLE IF EXISTS `proyecto_empleados`;
CREATE TABLE `proyecto_empleados` (
  `id_proyecto_empleado` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto` INTEGER NOT NULL,
  `id_usuario` INTEGER NOT NULL,
  `fecha_asignacion` DATETIME,
  CONSTRAINT `fk_proyecto_empleados_id_proyecto` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`),
  CONSTRAINT `fk_proyecto_empleados_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: proyecto_materiales
DROP TABLE IF EXISTS `proyecto_materiales`;
CREATE TABLE `proyecto_materiales` (
  `id_proyecto_material` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto` INTEGER NOT NULL,
  `id_producto` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL DEFAULT 1,
  `precio_unitario` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `precio_total` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `fecha_creacion` DATETIME,
  CONSTRAINT `fk_proyecto_materiales_id_proyecto` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`),
  CONSTRAINT `fk_proyecto_materiales_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: proyecto_sedes
DROP TABLE IF EXISTS `proyecto_sedes`;
CREATE TABLE `proyecto_sedes` (
  `id_proyecto_sede` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto` INTEGER NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `ubicacion` TEXT,
  `presupuesto_materiales` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `presupuesto_servicios` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `presupuesto_total` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `presupuesto_restante` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `fecha_creacion` DATETIME,
  CONSTRAINT `fk_proyecto_sedes_id_proyecto` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: proyecto_servicios
DROP TABLE IF EXISTS `proyecto_servicios`;
CREATE TABLE `proyecto_servicios` (
  `id_proyecto_servicio` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto` INTEGER NOT NULL,
  `id_servicio` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL DEFAULT 1,
  `precio_unitario` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `precio_total` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `fecha_creacion` DATETIME,
  CONSTRAINT `fk_proyecto_servicios_id_proyecto` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`),
  CONSTRAINT `fk_proyecto_servicios_id_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: salidas_material
DROP TABLE IF EXISTS `salidas_material`;
CREATE TABLE `salidas_material` (
  `id_salida_material` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto` INTEGER NOT NULL,
  `id_proyecto_sede` INTEGER,
  `id_producto` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL DEFAULT 1,
  `id_entregador` INTEGER NOT NULL,
  `receptor` VARCHAR(200) NOT NULL,
  `observaciones` TEXT,
  `costo_total` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `fecha_salida` DATETIME NOT NULL,
  CONSTRAINT `fk_salidas_material_id_proyecto` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`),
  CONSTRAINT `fk_salidas_material_id_proyecto_sede` FOREIGN KEY (`id_proyecto_sede`) REFERENCES `proyecto_sedes`(`id_proyecto_sede`),
  CONSTRAINT `fk_salidas_material_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
  CONSTRAINT `fk_salidas_material_id_entregador` FOREIGN KEY (`id_entregador`) REFERENCES `usuarios`(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: sede_materiales
DROP TABLE IF EXISTS `sede_materiales`;
CREATE TABLE `sede_materiales` (
  `id_sede_material` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto_sede` INTEGER NOT NULL,
  `id_producto` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL DEFAULT 1,
  `fecha_asignacion` DATETIME,
  CONSTRAINT `fk_sede_materiales_id_proyecto_sede` FOREIGN KEY (`id_proyecto_sede`) REFERENCES `proyecto_sedes`(`id_proyecto_sede`),
  CONSTRAINT `fk_sede_materiales_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: sede_servicios
DROP TABLE IF EXISTS `sede_servicios`;
CREATE TABLE `sede_servicios` (
  `id_sede_servicio` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto_sede` INTEGER NOT NULL,
  `id_servicio` INTEGER NOT NULL,
  `cantidad` INTEGER NOT NULL DEFAULT 1,
  `precio_unitario` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `fecha_asignacion` DATETIME,
  `estado` VARCHAR(255) NOT NULL DEFAULT 'pendiente',
  `fecha_completado` DATETIME,
  CONSTRAINT `fk_sede_servicios_id_proyecto_sede` FOREIGN KEY (`id_proyecto_sede`) REFERENCES `proyecto_sedes`(`id_proyecto_sede`),
  CONSTRAINT `fk_sede_servicios_id_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: citas
DROP TABLE IF EXISTS `citas`;
CREATE TABLE `citas` (
  `id_cita` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `direccion` VARCHAR(200),
  `observaciones` VARCHAR(300),
  `id_usuario` INTEGER NOT NULL,
  `id_cliente` INTEGER NOT NULL,
  `id_servicio` INTEGER,
  `estado` VARCHAR(255) DEFAULT 'Pendiente',
  CONSTRAINT `fk_citas_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`),
  CONSTRAINT `fk_citas_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`),
  CONSTRAINT `fk_citas_id_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: programaciones_laborales
DROP TABLE IF EXISTS `programaciones_laborales`;
CREATE TABLE `programaciones_laborales` (
  `id_programacion` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `fecha_inicio` DATETIME NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `id_usuario` INTEGER NOT NULL,
  CONSTRAINT `fk_programaciones_laborales_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: pagos_abonos
DROP TABLE IF EXISTS `pagos_abonos`;
CREATE TABLE `pagos_abonos` (
  `id_pago_abono` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_proyecto` INTEGER NOT NULL,
  `fecha` DATETIME NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `metodo_pago` VARCHAR(255) NOT NULL,
  `estado` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: rol_permiso_privilegio
DROP TABLE IF EXISTS `rol_permiso_privilegio`;
CREATE TABLE `rol_permiso_privilegio` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_rol` INTEGER NOT NULL,
  `id_permiso` INTEGER NOT NULL,
  `id_privilegio` INTEGER NOT NULL,
  CONSTRAINT `fk_rol_permiso_privilegio_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`),
  CONSTRAINT `fk_rol_permiso_privilegio_id_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permisos`(`id_permiso`),
  CONSTRAINT `fk_rol_permiso_privilegio_id_privilegio` FOREIGN KEY (`id_privilegio`) REFERENCES `privilegios`(`id_privilegio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
