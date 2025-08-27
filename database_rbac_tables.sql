-- Script para crear las tablas del sistema RBAC (Role-Based Access Control)
-- Conv3rTech - Sistema de Gestión

-- Tabla roles
CREATE TABLE roles (
    id_rol INT GENERATED ALWAYS AS IDENTITY,
    nombre_rol VARCHAR(60) NOT NULL,
    descripcion TEXT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_roles PRIMARY KEY (id_rol),
    CONSTRAINT uc_roles_nombre_rol UNIQUE (nombre_rol),
    CONSTRAINT chk_roles_nombre CHECK (nombre_rol ~ '^[A-Za-z ]+$')
);

-- Tabla permisos (módulos del sistema)
CREATE TABLE permisos (
    id_permiso INT GENERATED ALWAYS AS IDENTITY,
    nombre_permiso VARCHAR(30) NOT NULL,
    CONSTRAINT pk_permisos PRIMARY KEY (id_permiso),
    CONSTRAINT uc_permisos_nombre UNIQUE (nombre_permiso),
    CONSTRAINT chk_permisos_nombre CHECK (nombre_permiso ~ '^[A-Za-z ]+$')
);

-- Tabla privilegios (acciones genéricas)
CREATE TABLE privilegios (
    id_privilegio INT GENERATED ALWAYS AS IDENTITY,
    nombre_privilegio VARCHAR(30) NOT NULL,
    CONSTRAINT pk_privilegios PRIMARY KEY (id_privilegio),
    CONSTRAINT uc_privilegios_nombre UNIQUE (nombre_privilegio),
    CONSTRAINT chk_privilegios_nombre CHECK (nombre_privilegio ~ '^[A-Za-z ]+$')
);

-- Relación permiso + privilegio (PP)
CREATE TABLE permiso_privilegio (
    id_pp INT GENERATED ALWAYS AS IDENTITY,
    id_permiso INT NOT NULL,
    id_privilegio INT NOT NULL,
    CONSTRAINT pk_permiso_privilegio PRIMARY KEY (id_pp),
    CONSTRAINT uc_permiso_privilegio UNIQUE (id_permiso, id_privilegio),
    CONSTRAINT fk_pp_permiso FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE,
    CONSTRAINT fk_pp_privilegio FOREIGN KEY (id_privilegio) REFERENCES privilegios(id_privilegio) ON DELETE CASCADE
);

-- Relación rol + permiso_privilegio (RBAC completo)
CREATE TABLE rol_pp (
    id_rol INT NOT NULL,
    id_pp INT NOT NULL,
    PRIMARY KEY (id_rol, id_pp),
    CONSTRAINT fk_rpp_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rpp_pp FOREIGN KEY (id_pp) REFERENCES permiso_privilegio(id_pp) ON DELETE CASCADE
);

-- Tabla estado_usuarios
CREATE TABLE estado_usuarios (
    id_estado_usuario INT GENERATED ALWAYS AS IDENTITY,
    estado VARCHAR(50) NOT NULL,
    CONSTRAINT pk_estado_usuarios PRIMARY KEY (id_estado_usuario),
    CONSTRAINT uc_estado_usuarios_estado UNIQUE (estado),
    CONSTRAINT chk_estado_usuarios_estado CHECK (estado ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')
);

-- Tabla usuarios (relaciona con rol, estado)
CREATE TABLE usuarios (
    id_usuario INT GENERATED ALWAYS AS IDENTITY,
    documento VARCHAR(15) NOT NULL,
    tipo_documento VARCHAR(4) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    celular VARCHAR(15) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_estado_usuario INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uc_usuarios_documento UNIQUE (documento),
    CONSTRAINT uc_usuarios_correo UNIQUE (correo),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    CONSTRAINT fk_usuarios_estado FOREIGN KEY (id_estado_usuario) REFERENCES estado_usuarios(id_estado_usuario),
    CONSTRAINT chk_usuarios_documento CHECK (documento ~ '^[A-Za-z0-9]+$'),
    CONSTRAINT chk_usuarios_tipo_documento CHECK (tipo_documento IN ('CC','CE','PPT','NIT')),
    CONSTRAINT chk_usuarios_nombre CHECK (nombre ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .-]+$'),
    CONSTRAINT chk_usuarios_apellido CHECK (apellido ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .-]+$'),
    CONSTRAINT chk_usuarios_celular CHECK (celular ~ '^\\+?\\d{7,15}$'),
    CONSTRAINT chk_usuarios_correo CHECK (correo ~ '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
);

-- Datos iniciales para el sistema RBAC

-- Insertar estados de usuario
INSERT INTO estado_usuarios (estado) VALUES 
('Activo'),
('Inactivo'),
('Suspendido'),
('Pendiente de activación');

-- Insertar roles básicos
INSERT INTO roles (nombre_rol, descripcion, estado) VALUES 
('Administrador', 'Rol con acceso completo al sistema', true),
('Gerente', 'Rol con acceso a gestión y reportes', true),
('Supervisor', 'Rol con acceso a supervisión de proyectos', true),
('Empleado', 'Rol básico para empleados', true),
('Cliente', 'Rol para clientes del sistema', true);

-- Insertar permisos (módulos del sistema)
INSERT INTO permisos (nombre_permiso) VALUES 
('Usuarios'),
('Roles'),
('Clientes'),
('Proyectos'),
('Productos'),
('Servicios'),
('Compras'),
('Ventas'),
('Reportes'),
('Configuracion');

-- Insertar privilegios (acciones genéricas)
INSERT INTO privilegios (nombre_privilegio) VALUES 
('Crear'),
('Leer'),
('Actualizar'),
('Eliminar'),
('Exportar'),
('Importar'),
('Aprobar'),
('Rechazar');

-- Crear relaciones permiso-privilegio para el administrador (acceso completo)
INSERT INTO permiso_privilegio (id_permiso, id_privilegio)
SELECT p.id_permiso, pr.id_privilegio
FROM permisos p, privilegios pr;

-- Asignar todos los permisos-privilegios al rol administrador
INSERT INTO rol_pp (id_rol, id_pp)
SELECT 1, pp.id_pp
FROM permiso_privilegio pp;

-- Crear relaciones permiso-privilegio para el gerente (acceso limitado)
INSERT INTO permiso_privilegio (id_permiso, id_privilegio)
SELECT p.id_permiso, pr.id_privilegio
FROM permisos p, privilegios pr
WHERE p.nombre_permiso IN ('Clientes', 'Proyectos', 'Productos', 'Servicios', 'Compras', 'Ventas', 'Reportes')
AND pr.nombre_privilegio IN ('Crear', 'Leer', 'Actualizar', 'Exportar', 'Aprobar', 'Rechazar');

-- Asignar permisos-privilegios al rol gerente
INSERT INTO rol_pp (id_rol, id_pp)
SELECT 2, pp.id_pp
FROM permiso_privilegio pp
WHERE pp.id_pp > (SELECT COUNT(*) FROM permisos) * (SELECT COUNT(*) FROM privilegios);

-- Crear relaciones permiso-privilegio para el supervisor
INSERT INTO permiso_privilegio (id_permiso, id_privilegio)
SELECT p.id_permiso, pr.id_privilegio
FROM permisos p, privilegios pr
WHERE p.nombre_permiso IN ('Proyectos', 'Productos', 'Servicios', 'Reportes')
AND pr.nombre_privilegio IN ('Crear', 'Leer', 'Actualizar', 'Exportar');

-- Asignar permisos-privilegios al rol supervisor
INSERT INTO rol_pp (id_rol, id_pp)
SELECT 3, pp.id_pp
FROM permiso_privilegio pp
WHERE pp.id_pp > (SELECT COUNT(*) FROM permisos) * (SELECT COUNT(*) FROM privilegios) * 2;

-- Crear relaciones permiso-privilegio para el empleado
INSERT INTO permiso_privilegio (id_permiso, id_privilegio)
SELECT p.id_permiso, pr.id_privilegio
FROM permisos p, privilegios pr
WHERE p.nombre_permiso IN ('Proyectos', 'Productos', 'Servicios')
AND pr.nombre_privilegio IN ('Leer', 'Actualizar');

-- Asignar permisos-privilegios al rol empleado
INSERT INTO rol_pp (id_rol, id_pp)
SELECT 4, pp.id_pp
FROM permiso_privilegio pp
WHERE pp.id_pp > (SELECT COUNT(*) FROM permisos) * (SELECT COUNT(*) FROM privilegios) * 3;

-- Crear relaciones permiso-privilegio para el cliente
INSERT INTO permiso_privilegio (id_permiso, id_privilegio)
SELECT p.id_permiso, pr.id_privilegio
FROM permisos p, privilegios pr
WHERE p.nombre_permiso IN ('Proyectos', 'Servicios')
AND pr.nombre_privilegio IN ('Leer');

-- Asignar permisos-privilegios al rol cliente
INSERT INTO rol_pp (id_rol, id_pp)
SELECT 5, pp.id_pp
FROM permiso_privilegio pp
WHERE pp.id_pp > (SELECT COUNT(*) FROM permisos) * (SELECT COUNT(*) FROM privilegios) * 4;

-- Crear usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO usuarios (documento, tipo_documento, nombre, apellido, celular, correo, contrasena, id_rol, id_estado_usuario, fecha_creacion) VALUES 
('12345678', 'CC', 'Administrador', 'Sistema', '+573001234567', 'admin@conv3rtech.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 1, 1, CURRENT_TIMESTAMP);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_usuarios_estado ON usuarios(id_estado_usuario);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_documento ON usuarios(documento);

CREATE INDEX idx_permiso_privilegio_permiso ON permiso_privilegio(id_permiso);
CREATE INDEX idx_permiso_privilegio_privilegio ON permiso_privilegio(id_privilegio);

CREATE INDEX idx_rol_pp_rol ON rol_pp(id_rol);
CREATE INDEX idx_rol_pp_pp ON rol_pp(id_pp);

-- Comentarios sobre el sistema RBAC
COMMENT ON TABLE roles IS 'Tabla de roles del sistema RBAC';
COMMENT ON TABLE permisos IS 'Tabla de permisos (módulos del sistema)';
COMMENT ON TABLE privilegios IS 'Tabla de privilegios (acciones genéricas)';
COMMENT ON TABLE permiso_privilegio IS 'Tabla intermedia que relaciona permisos con privilegios';
COMMENT ON TABLE rol_pp IS 'Tabla intermedia que relaciona roles con permiso_privilegio (RBAC completo)';
COMMENT ON TABLE estado_usuarios IS 'Tabla de estados posibles para los usuarios';
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con relaciones a roles y estados';
