const bcrypt = require("bcryptjs");
const {
  Users,
  Roles,
  Permisos,
  Privilegios,
  RolPermisoPrivilegio,
  EstadoUsuarios,
} = require("../models/associations");

class DataInitializer {
  constructor() {
    this.saltRounds = 12;
  }

  /**
   * Encripta una contraseña
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Inicializa los estados de usuario
   */
  async initEstadosUsuarios() {
    try {
      const estados = [
        { estado: "Activo" },
        { estado: "Inactivo" },
        { estado: "Suspendido" },
      ];

      for (const estado of estados) {
        await EstadoUsuarios.findOrCreate({
          where: { estado: estado.estado },
          defaults: estado,
        });
      }

      console.log("✅ Estados de usuarios inicializados");
    } catch (error) {
      console.error("❌ Error inicializando estados de usuarios:", error);
    }
  }

  /**
   * Inicializa los roles
   */
  async initRoles() {
    try {
      const roles = [
        {
          nombre_rol: "Administrador",
          descripcion:
            "Acceso completo al sistema con todos los permisos y privilegios",
        },
        {
          nombre_rol: "Coordinador",
          descripcion: "Puede ver y crear, pero no editar ni eliminar",
        },
        {
          nombre_rol: "Tecnico",
          descripcion:
            "Solo puede ver módulos específicos y sus datos asignados",
        },
      ];

      for (const rol of roles) {
        try {
          await Roles.findOrCreate({
            where: { nombre_rol: rol.nombre_rol },
            defaults: rol,
          });
        } catch (error) {
          console.log(
            `⚠️  Rol ${rol.nombre_rol} ya existe o hubo un error:`,
            error.message
          );
        }
      }

      console.log("✅ Roles inicializados");
    } catch (error) {
      console.error("❌ Error inicializando roles:", error);
    }
  }

  /**
   * Inicializa los permisos (módulos)
   */
  async initPermisos() {
    try {
      const permisos = [
        // Dashboard
        "dashboard",

        // Usuarios
        "usuarios",

        // Módulo de Compras
        "proveedores",
        "categoria_productos",
        "productos",
        "compras",

        // Módulo de Servicios
        "servicios",
        "categoria_servicios",
        "programacion_laboral",

        // Módulo de Ventas
        "clientes",
        "venta_productos",
        "ordenes_servicios",
        "citas",
        "cotizaciones",
        "proyectos_servicios",
        "pagosyabonos",

        // Configuración
        "roles",
      ];

      for (const permiso of permisos) {
        await Permisos.findOrCreate({
          where: { nombre_permiso: permiso },
          defaults: { nombre_permiso: permiso },
        });
      }

      console.log("✅ Permisos inicializados");
    } catch (error) {
      console.error("❌ Error inicializando permisos:", error);
    }
  }

  /**
   * Inicializa los privilegios
   */
  async initPrivilegios() {
    try {
      const privilegios = ["crear", "leer", "actualizar", "eliminar"];

      for (const privilegio of privilegios) {
        await Privilegios.findOrCreate({
          where: { nombre_privilegio: privilegio },
          defaults: { nombre_privilegio: privilegio },
        });
      }

      console.log("✅ Privilegios inicializados");
    } catch (error) {
      console.error("❌ Error inicializando privilegios:", error);
    }
  }

  /**
   * Asigna permisos a los roles
   */
  async assignPermissions() {
    try {
      // Obtener roles
      const adminRole = await Roles.findOne({
        where: { nombre_rol: "Administrador" },
      });
      const coordRole = await Roles.findOne({
        where: { nombre_rol: "Coordinador" },
      });
      const techRole = await Roles.findOne({
        where: { nombre_rol: "Tecnico" },
      });

      // Obtener todos los permisos
      const allPermisos = await Permisos.findAll();
      const allPrivilegios = await Privilegios.findAll();

      // Obtener privilegios específicos
      const crearPrivilegio = await Privilegios.findOne({
        where: { nombre_privilegio: "crear" },
      });
      const leerPrivilegio = await Privilegios.findOne({
        where: { nombre_privilegio: "leer" },
      });
      const actualizarPrivilegio = await Privilegios.findOne({
        where: { nombre_privilegio: "actualizar" },
      });
      const eliminarPrivilegio = await Privilegios.findOne({
        where: { nombre_privilegio: "eliminar" },
      });

      // ADMINISTRADOR: Todos los permisos y privilegios
      for (const permiso of allPermisos) {
        for (const privilegio of allPrivilegios) {
          try {
            await RolPermisoPrivilegio.findOrCreate({
              where: {
                id_rol: adminRole.id_rol,
                id_permiso: permiso.id_permiso,
                id_privilegio: privilegio.id_privilegio,
              },
              defaults: {
                id_rol: adminRole.id_rol,
                id_permiso: permiso.id_permiso,
                id_privilegio: privilegio.id_privilegio,
              },
            });
          } catch (error) {
            console.log(
              `⚠️  Permiso ya existe para Admin: ${permiso.nombre_permiso} - ${privilegio.nombre_privilegio}`
            );
          }
        }
      }

      // COORDINADOR: Todos los permisos, pero solo crear y leer
      for (const permiso of allPermisos) {
        try {
          // Crear
          await RolPermisoPrivilegio.findOrCreate({
            where: {
              id_rol: coordRole.id_rol,
              id_permiso: permiso.id_permiso,
              id_privilegio: crearPrivilegio.id_privilegio,
            },
            defaults: {
              id_rol: coordRole.id_rol,
              id_permiso: permiso.id_permiso,
              id_privilegio: crearPrivilegio.id_privilegio,
            },
          });

          // Leer
          await RolPermisoPrivilegio.findOrCreate({
            where: {
              id_rol: coordRole.id_rol,
              id_permiso: permiso.id_permiso,
              id_privilegio: leerPrivilegio.id_privilegio,
            },
            defaults: {
              id_rol: coordRole.id_rol,
              id_permiso: permiso.id_permiso,
              id_privilegio: leerPrivilegio.id_privilegio,
            },
          });
        } catch (error) {
          console.log(
            `⚠️  Permiso ya existe para Coordinador: ${permiso.nombre_permiso} - crear/leer`
          );
        }
      }

      // TÉCNICO: Solo módulos específicos y solo leer
      const techPermisos = [
        "dashboard",
        "citas",
        "programacion_laboral",
        "proyectos_servicios",
      ];

      for (const permisoName of techPermisos) {
        const permiso = await Permisos.findOne({
          where: { nombre_permiso: permisoName },
        });
        if (permiso) {
          try {
            await RolPermisoPrivilegio.findOrCreate({
              where: {
                id_rol: techRole.id_rol,
                id_permiso: permiso.id_permiso,
                id_privilegio: leerPrivilegio.id_privilegio,
              },
              defaults: {
                id_rol: techRole.id_rol,
                id_permiso: permiso.id_permiso,
                id_privilegio: leerPrivilegio.id_privilegio,
              },
            });
          } catch (error) {
            console.log(
              `⚠️  Permiso ya existe para Técnico: ${permiso.nombre_permiso} - leer`
            );
          }
        }
      }

      console.log("✅ Permisos asignados a roles");
    } catch (error) {
      console.error("❌ Error asignando permisos:", error);
    }
  }

  /**
   * Crea usuarios de prueba
   */
  async createTestUsers() {
    try {
      // Obtener roles y estado activo
      const adminRole = await Roles.findOne({
        where: { nombre_rol: "Administrador" },
      });
      const coordRole = await Roles.findOne({
        where: { nombre_rol: "Coordinador" },
      });
      const techRole = await Roles.findOne({
        where: { nombre_rol: "Tecnico" },
      });
      const estadoActivo = await EstadoUsuarios.findOne({
        where: { estado: "Activo" },
      });

      const password = await this.hashPassword("123456");

      // 1 ADMINISTRADOR
      const adminUser = {
        documento: "12345678",
        tipo_documento: "CC",
        nombre: "Admin",
        apellido: "Sistema",
        celular: "3001234567",
        correo: "admin@conv3rtech.com",
        contrasena: password,
        id_rol: adminRole.id_rol,
        id_estado_usuario: estadoActivo.id_estado_usuario,
      };

      await Users.findOrCreate({
        where: { correo: adminUser.correo },
        defaults: adminUser,
      });

      // 5 COORDINADORES
      const coordinadores = [
        {
          documento: "87654321",
          tipo_documento: "CC",
          nombre: "María",
          apellido: "González",
          celular: "3001111111",
          correo: "maria.gonzalez@conv3rtech.com",
          contrasena: password,
          id_rol: coordRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "87654322",
          tipo_documento: "CC",
          nombre: "Carlos",
          apellido: "Rodríguez",
          celular: "3002222222",
          correo: "carlos.rodriguez@conv3rtech.com",
          contrasena: password,
          id_rol: coordRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "87654323",
          tipo_documento: "CC",
          nombre: "Ana",
          apellido: "Martínez",
          celular: "3003333333",
          correo: "ana.martinez@conv3rtech.com",
          contrasena: password,
          id_rol: coordRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "87654324",
          tipo_documento: "CC",
          nombre: "Luis",
          apellido: "Hernández",
          celular: "3004444444",
          correo: "luis.hernandez@conv3rtech.com",
          contrasena: password,
          id_rol: coordRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "87654325",
          tipo_documento: "CC",
          nombre: "Patricia",
          apellido: "López",
          celular: "3005555555",
          correo: "patricia.lopez@conv3rtech.com",
          contrasena: password,
          id_rol: coordRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
      ];

      for (const coordinador of coordinadores) {
        await Users.findOrCreate({
          where: { correo: coordinador.correo },
          defaults: coordinador,
        });
      }

      // 20 TÉCNICOS
      const tecnicos = [
        {
          documento: "11111111",
          tipo_documento: "CC",
          nombre: "Juan",
          apellido: "Pérez",
          celular: "3006666666",
          correo: "juan.perez@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111112",
          tipo_documento: "CC",
          nombre: "María",
          apellido: "Alvarez",
          celular: "3007777777",
          correo: "maria.alvarez@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111113",
          tipo_documento: "CC",
          nombre: "Carlos",
          apellido: "Ramírez",
          celular: "3008888888",
          correo: "carlos.ramirez@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111114",
          tipo_documento: "CC",
          nombre: "Laura",
          apellido: "Gómez",
          celular: "3009999999",
          correo: "laura.gomez@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111115",
          tipo_documento: "CC",
          nombre: "Andrés",
          apellido: "Torres",
          celular: "3010000000",
          correo: "andres.torres@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111116",
          tipo_documento: "CC",
          nombre: "Camila",
          apellido: "Rodríguez",
          celular: "3011111111",
          correo: "camila.rodriguez@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111117",
          tipo_documento: "CC",
          nombre: "Diego",
          apellido: "Silva",
          celular: "3012222222",
          correo: "diego.silva@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111118",
          tipo_documento: "CC",
          nombre: "Sofia",
          apellido: "Castro",
          celular: "3013333333",
          correo: "sofia.castro@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111119",
          tipo_documento: "CC",
          nombre: "Roberto",
          apellido: "Mendoza",
          celular: "3014444444",
          correo: "roberto.mendoza@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111120",
          tipo_documento: "CC",
          nombre: "Valentina",
          apellido: "Herrera",
          celular: "3015555555",
          correo: "valentina.herrera@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111121",
          tipo_documento: "CC",
          nombre: "Fernando",
          apellido: "Vargas",
          celular: "3016666666",
          correo: "fernando.vargas@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111122",
          tipo_documento: "CC",
          nombre: "Isabella",
          apellido: "Rojas",
          celular: "3017777777",
          correo: "isabella.rojas@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111123",
          tipo_documento: "CC",
          nombre: "Gabriel",
          apellido: "Jiménez",
          celular: "3018888888",
          correo: "gabriel.jimenez@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111124",
          tipo_documento: "CC",
          nombre: "Daniela",
          apellido: "Moreno",
          celular: "3019999999",
          correo: "daniela.moreno@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111125",
          tipo_documento: "CC",
          nombre: "Alejandro",
          apellido: "Ruiz",
          celular: "3020000000",
          correo: "alejandro.ruiz@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111126",
          tipo_documento: "CC",
          nombre: "Natalia",
          apellido: "Díaz",
          celular: "3021111111",
          correo: "natalia.diaz@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111127",
          tipo_documento: "CC",
          nombre: "Sebastián",
          apellido: "Aguilar",
          celular: "3022222222",
          correo: "sebastian.aguilar@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111128",
          tipo_documento: "CC",
          nombre: "Mariana",
          apellido: "Flores",
          celular: "3023333333",
          correo: "mariana.flores@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111129",
          tipo_documento: "CC",
          nombre: "Ricardo",
          apellido: "Cruz",
          celular: "3024444444",
          correo: "ricardo.cruz@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
        {
          documento: "11111130",
          tipo_documento: "CC",
          nombre: "Adriana",
          apellido: "Reyes",
          celular: "3025555555",
          correo: "adriana.reyes@conv3rtech.com",
          contrasena: password,
          id_rol: techRole.id_rol,
          id_estado_usuario: estadoActivo.id_estado_usuario,
        },
      ];

      for (const tecnico of tecnicos) {
        await Users.findOrCreate({
          where: { correo: tecnico.correo },
          defaults: tecnico,
        });
      }

      console.log("✅ Usuarios de prueba creados");
      console.log("📋 Resumen de usuarios creados:");
      console.log("   - 1 Administrador");
      console.log("   - 5 Coordinadores");
      console.log("   - 20 Técnicos");
      console.log("🔑 Contraseña para todos: 123456");
    } catch (error) {
      console.error("❌ Error creando usuarios de prueba:", error);
    }
  }

  /**
   * Ejecuta toda la inicialización
   */
  async init() {
    console.log("🚀 Iniciando configuración de la base de datos...\n");

    await this.initEstadosUsuarios();
    await this.initRoles();
    await this.initPermisos();
    await this.initPrivilegios();
    await this.assignPermissions();
    await this.createTestUsers();

    console.log("\n✅ Configuración completada exitosamente!");
    console.log("\n📝 Información de acceso:");
    console.log("   Administrador: admin@conv3rtech.com / 123456");
    console.log("   Coordinador: maria.gonzalez@conv3rtech.com / 123456");
    console.log("   Técnico: juan.perez@conv3rtech.com / 123456");
  }
}

module.exports = DataInitializer;
