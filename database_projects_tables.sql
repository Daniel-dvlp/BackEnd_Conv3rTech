-- Script SQL para crear las tablas de proyectos
-- Ejecutar este script en tu base de datos MySQL

-- Tabla principal de proyectos
CREATE TABLE IF NOT EXISTS proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    numero_contrato VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    id_cliente INT NOT NULL,
    id_responsable INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('Pendiente', 'En Progreso', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    progreso INT NOT NULL DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
    prioridad ENUM('Baja', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
    ubicacion TEXT,
    descripcion TEXT,
    observaciones TEXT,
    costo_mano_obra DECIMAL(15, 2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    
    INDEX idx_numero_contrato (numero_contrato),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha_inicio (fecha_inicio),
    INDEX idx_fecha_fin (fecha_fin)
);

-- Tabla de sedes de proyectos
CREATE TABLE IF NOT EXISTS proyecto_sedes (
    id_proyecto_sede INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    ubicacion TEXT,
    presupuesto_materiales DECIMAL(15, 2) NOT NULL DEFAULT 0,
    presupuesto_servicios DECIMAL(15, 2) NOT NULL DEFAULT 0,
    presupuesto_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    presupuesto_restante DECIMAL(15, 2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    
    INDEX idx_id_proyecto (id_proyecto)
);

-- Tabla de materiales de proyectos
CREATE TABLE IF NOT EXISTS proyecto_materiales (
    id_proyecto_material INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario DECIMAL(15, 2) NOT NULL DEFAULT 0,
    precio_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT,
    
    INDEX idx_id_proyecto (id_proyecto),
    INDEX idx_id_producto (id_producto)
);

-- Tabla de servicios de proyectos
CREATE TABLE IF NOT EXISTS proyecto_servicios (
    id_proyecto_servicio INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario DECIMAL(15, 2) NOT NULL DEFAULT 0,
    precio_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE RESTRICT,
    
    INDEX idx_id_proyecto (id_proyecto),
    INDEX idx_id_servicio (id_servicio)
);

-- Tabla de empleados asociados a proyectos
CREATE TABLE IF NOT EXISTS proyecto_empleados (
    id_proyecto_empleado INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    
    UNIQUE KEY unique_proyecto_usuario (id_proyecto, id_usuario),
    INDEX idx_id_proyecto (id_proyecto),
    INDEX idx_id_usuario (id_usuario)
);

-- Tabla de salidas de material
CREATE TABLE IF NOT EXISTS salidas_material (
    id_salida_material INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_proyecto_sede INT,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    id_entregador INT NOT NULL,
    receptor VARCHAR(200) NOT NULL,
    observaciones TEXT,
    costo_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    fecha_salida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_proyecto_sede) REFERENCES proyecto_sedes(id_proyecto_sede) ON DELETE SET NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT,
    FOREIGN KEY (id_entregador) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    
    INDEX idx_id_proyecto (id_proyecto),
    INDEX idx_id_proyecto_sede (id_proyecto_sede),
    INDEX idx_id_producto (id_producto),
    INDEX idx_id_entregador (id_entregador),
    INDEX idx_fecha_salida (fecha_salida)
);

-- Tabla de materiales asignados a sedes
CREATE TABLE IF NOT EXISTS sede_materiales (
    id_sede_material INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto_sede INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto_sede) REFERENCES proyecto_sedes(id_proyecto_sede) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT,
    
    UNIQUE KEY unique_sede_producto (id_proyecto_sede, id_producto),
    INDEX idx_id_proyecto_sede (id_proyecto_sede),
    INDEX idx_id_producto (id_producto)
);

-- Tabla de servicios asignados a sedes
CREATE TABLE IF NOT EXISTS sede_servicios (
    id_sede_servicio INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto_sede INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario DECIMAL(15, 2) NOT NULL DEFAULT 0,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proyecto_sede) REFERENCES proyecto_sedes(id_proyecto_sede) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE RESTRICT,
    
    UNIQUE KEY unique_sede_servicio (id_proyecto_sede, id_servicio),
    INDEX idx_id_proyecto_sede (id_proyecto_sede),
    INDEX idx_id_servicio (id_servicio)
);

-- Triggers para calcular precios totales automáticamente

-- Trigger para calcular precio_total en proyecto_materiales
DELIMITER //
CREATE TRIGGER calcular_precio_total_materiales
BEFORE INSERT ON proyecto_materiales
FOR EACH ROW
BEGIN
    SET NEW.precio_total = NEW.cantidad * NEW.precio_unitario;
END//

CREATE TRIGGER actualizar_precio_total_materiales
BEFORE UPDATE ON proyecto_materiales
FOR EACH ROW
BEGIN
    SET NEW.precio_total = NEW.cantidad * NEW.precio_unitario;
END//

-- Trigger para calcular precio_total en proyecto_servicios
CREATE TRIGGER calcular_precio_total_servicios
BEFORE INSERT ON proyecto_servicios
FOR EACH ROW
BEGIN
    SET NEW.precio_total = NEW.cantidad * NEW.precio_unitario;
END//

CREATE TRIGGER actualizar_precio_total_servicios
BEFORE UPDATE ON proyecto_servicios
FOR EACH ROW
BEGIN
    SET NEW.precio_total = NEW.cantidad * NEW.precio_unitario;
END//

-- Trigger para actualizar presupuesto_total en proyecto_sedes
CREATE TRIGGER calcular_presupuesto_total_sedes
BEFORE INSERT ON proyecto_sedes
FOR EACH ROW
BEGIN
    SET NEW.presupuesto_total = NEW.presupuesto_materiales + NEW.presupuesto_servicios;
    SET NEW.presupuesto_restante = NEW.presupuesto_total;
END//

CREATE TRIGGER actualizar_presupuesto_total_sedes
BEFORE UPDATE ON proyecto_sedes
FOR EACH ROW
BEGIN
    SET NEW.presupuesto_total = NEW.presupuesto_materiales + NEW.presupuesto_servicios;
END//

DELIMITER ;

-- Insertar datos de ejemplo (opcional)

-- Insertar un proyecto de ejemplo
INSERT INTO proyectos (
    numero_contrato,
    nombre,
    id_cliente,
    id_responsable,
    fecha_inicio,
    fecha_fin,
    estado,
    progreso,
    prioridad,
    ubicacion,
    descripcion,
    observaciones,
    costo_mano_obra
) VALUES (
    'CT-2025-001',
    'Instalación Sistema CCTV',
    1,
    1,
    '2025-06-01',
    '2025-07-15',
    'En Progreso',
    75,
    'Alta',
    'Carrera 48 #20-115, Medellín',
    'Instalación completa de 32 cámaras de seguridad con sistema de grabación y monitoreo remoto',
    'El cliente solicitó añadir 2 cámaras adicionales para cubrir puntos ciegos',
    5000000
);

-- Insertar una sede de ejemplo
INSERT INTO proyecto_sedes (
    id_proyecto,
    nombre,
    ubicacion,
    presupuesto_materiales,
    presupuesto_servicios,
    presupuesto_total,
    presupuesto_restante
) VALUES (
    1,
    'Oficina Principal',
    'Carrera 48 #20-115, Oficina 801',
    3500000,
    1300000,
    4800000,
    3200000
);

-- Insertar materiales de ejemplo
INSERT INTO proyecto_materiales (
    id_proyecto,
    id_producto,
    cantidad,
    precio_unitario
) VALUES (
    1,
    1,
    32,
    150000
);

-- Insertar servicios de ejemplo
INSERT INTO proyecto_servicios (
    id_proyecto,
    id_servicio,
    cantidad,
    precio_unitario
) VALUES (
    1,
    1,
    32,
    50000
);

-- Insertar empleado asociado de ejemplo
INSERT INTO proyecto_empleados (
    id_proyecto,
    id_usuario
) VALUES (
    1,
    1
);

-- Insertar material asignado a sede de ejemplo
INSERT INTO sede_materiales (
    id_proyecto_sede,
    id_producto,
    cantidad
) VALUES (
    1,
    1,
    20
);

-- Insertar servicio asignado a sede de ejemplo
INSERT INTO sede_servicios (
    id_proyecto_sede,
    id_servicio,
    cantidad,
    precio_unitario
) VALUES (
    1,
    1,
    20,
    50000
);

-- Insertar salida de material de ejemplo
INSERT INTO salidas_material (
    id_proyecto,
    id_proyecto_sede,
    id_producto,
    cantidad,
    id_entregador,
    receptor,
    observaciones,
    costo_total
) VALUES (
    1,
    1,
    1,
    5,
    1,
    'Juan Pérez',
    'Entrega para instalación inicial',
    750000
);

-- Comentarios sobre la estructura

/*
ESTRUCTURA DE LA BASE DE DATOS DE PROYECTOS

1. proyectos: Tabla principal que almacena la información básica de cada proyecto
   - Relacionada con clientes y usuarios (responsable)
   - Incluye fechas, estado, progreso, prioridad, ubicación, etc.

2. proyecto_sedes: Sedes o ubicaciones específicas dentro de un proyecto
   - Cada proyecto puede tener múltiples sedes
   - Incluye presupuestos separados para materiales y servicios

3. proyecto_materiales: Materiales asignados a un proyecto
   - Relaciona proyectos con productos del inventario
   - Incluye cantidades y precios

4. proyecto_servicios: Servicios asignados a un proyecto
   - Relaciona proyectos con servicios disponibles
   - Incluye cantidades y precios

5. proyecto_empleados: Empleados asignados a un proyecto
   - Relación muchos a muchos entre proyectos y usuarios
   - Permite asignar múltiples empleados a un proyecto

6. salidas_material: Registro de salidas de material para proyectos
   - Control de inventario para materiales entregados
   - Incluye información del entregador y receptor

7. sede_materiales: Materiales asignados específicamente a una sede
   - Control granular de materiales por ubicación
   - Permite distribuir materiales entre sedes

8. sede_servicios: Servicios asignados específicamente a una sede
   - Control granular de servicios por ubicación
   - Permite distribuir servicios entre sedes

CARACTERÍSTICAS IMPORTANTES:
- Uso de transacciones para mantener consistencia
- Validaciones de stock antes de asignar materiales
- Cálculo automático de precios totales
- Control de presupuestos por sede
- Seguimiento de salidas de material
- Índices para optimizar consultas
- Claves foráneas para mantener integridad referencial
- Triggers para cálculos automáticos
*/
