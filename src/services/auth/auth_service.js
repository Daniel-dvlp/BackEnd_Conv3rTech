const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users, Roles, Permisos, Privilegios, RolPermisoPrivilegio, EstadoUsuarios } = require('../../models/associations');

class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'conv3rtech-secret-key-2024';
    this.tokenExpiration = '24h';
  }

  /**
   * Genera un token JWT para el usuario
   * @param {Object} user - Objeto del usuario
   * @returns {String} Token JWT
   */
  generateToken(user) {
    const payload = {
      id: user.id_usuario,
      email: user.correo,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol?.nombre_rol || 'Sin rol',
      id_rol: user.id_rol
    };

    return jwt.sign(payload, this.secretKey, { expiresIn: this.tokenExpiration });
  }

  /**
   * Verifica un token JWT
   * @param {String} token - Token JWT
   * @returns {Object} Payload del token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Autentica un usuario con email y contraseña
   * @param {String} email - Email del usuario
   * @param {String} password - Contraseña del usuario
   * @returns {Object} Usuario autenticado con token
   */
  async authenticateUser(email, password) {
    try {
      // Buscar usuario con su rol y estado
      const user = await Users.findOne({
        where: { correo: email },
        include: [
          {
            model: Roles,
            as: 'rol',
            attributes: ['id_rol', 'nombre_rol', 'descripcion']
          },
          {
            model: EstadoUsuarios,
            as: 'estado',
            attributes: ['id_estado_usuario', 'estado']
          }
        ]
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el usuario está activo
      if (user.estado.estado !== 'Activo') {
        throw new Error(`Usuario ${user.estado.estado.toLowerCase()}`);
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.contrasena);
      if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
      }

      // Generar token
      const token = this.generateToken(user);

      // Obtener permisos del usuario
      const permissions = await this.getUserPermissions(user.id_rol);

      return {
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.correo,
          documento: user.documento,
          tipo_documento: user.tipo_documento,
          celular: user.celular,
          rol: user.rol.nombre_rol,
          id_rol: user.id_rol,
          estado: user.estado.estado,
          fecha_creacion: user.fecha_creacion
        },
        token,
        permissions
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene los permisos de un rol específico
   * @param {Number} roleId - ID del rol
   * @returns {Object} Permisos organizados por módulo
   */
  async getUserPermissions(roleId) {
    try {
      const { Sequelize } = require('sequelize');
      const sequelize = require('../../config/database');
      
      const permissions = await sequelize.query(`
        SELECT 
          p.nombre_permiso,
          pr.nombre_privilegio
        FROM rol_permiso_privilegio rpp
        JOIN permisos p ON rpp.id_permiso = p.id_permiso
        JOIN privilegios pr ON rpp.id_privilegio = pr.id_privilegio
        WHERE rpp.id_rol = ?
        ORDER BY p.nombre_permiso, pr.nombre_privilegio
      `, {
        replacements: [roleId],
        type: Sequelize.QueryTypes.SELECT
      });

      // Organizar permisos por módulo
      const organizedPermissions = {};
      
      permissions.forEach(permission => {
        const moduleName = permission.nombre_permiso;
        const privilege = permission.nombre_privilegio;
        
        if (!organizedPermissions[moduleName]) {
          organizedPermissions[moduleName] = [];
        }
        
        organizedPermissions[moduleName].push(privilege);
      });

      return organizedPermissions;
    } catch (error) {
      console.error('Error obteniendo permisos:', error);
      return {};
    }
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   * @param {Number} roleId - ID del rol
   * @param {String} module - Nombre del módulo
   * @param {String} privilege - Privilegio requerido
   * @returns {Boolean} True si tiene el permiso
   */
  async hasPermission(roleId, module, privilege) {
    try {
      const { Sequelize } = require('sequelize');
      const sequelize = require('../../config/database');
      
      const permissions = await sequelize.query(`
        SELECT COUNT(*) as count
        FROM rol_permiso_privilegio rpp
        JOIN permisos p ON rpp.id_permiso = p.id_permiso
        JOIN privilegios pr ON rpp.id_privilegio = pr.id_privilegio
        WHERE rpp.id_rol = ? AND p.nombre_permiso = ? AND pr.nombre_privilegio = ?
      `, {
        replacements: [roleId, module, privilege],
        type: Sequelize.QueryTypes.SELECT
      });

      return permissions[0].count > 0;
    } catch (error) {
      console.error('Error verificando permiso:', error);
      return false;
    }
  }

  /**
   * Encripta una contraseña
   * @param {String} password - Contraseña en texto plano
   * @returns {String} Contraseña encriptada
   */
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifica si un usuario existe por email
   * @param {String} email - Email del usuario
   * @returns {Boolean} True si existe
   */
  async userExists(email) {
    const user = await Users.findOne({ where: { correo: email } });
    return !!user;
  }

  /**
   * Obtiene información básica del usuario por ID
   * @param {Number} userId - ID del usuario
   * @returns {Object} Información del usuario
   */
  async getUserById(userId) {
    try {
      const user = await Users.findByPk(userId, {
        include: [
          {
            model: Roles,
            as: 'rol',
            attributes: ['id_rol', 'nombre_rol']
          },
          {
            model: EstadoUsuarios,
            as: 'estado',
            attributes: ['estado']
          }
        ],
        attributes: { exclude: ['contrasena'] }
      });

      return user;
    } catch (error) {
      throw new Error('Error obteniendo información del usuario');
    }
  }
}

module.exports = new AuthService();
