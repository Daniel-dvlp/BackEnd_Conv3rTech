const RBACService = require("../../services/auth/RBACService");
const { checkPermission } = require("../../middlewares/auth/checkPermission");

class RBACController {
  /**
   * Obtener permisos del usuario autenticado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getMyPermissions(req, res) {
    try {
      const userId = req.user.id_usuario;
      const permissions = await RBACService.getUserPermissions(userId);

      res.json({
        success: true,
        data: permissions,
        message: "Permisos obtenidos correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Obtener todos los roles con sus permisos
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllRolesWithPermissions(req, res) {
    try {
      const roles = await RBACService.getAllRolesWithPermissions();

      res.json({
        success: true,
        data: roles,
        message: "Roles obtenidos correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Asignar permisos a un rol
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async assignPermissionsToRole(req, res) {
    try {
      const { roleId } = req.params;
      const { permissions } = req.body;

      if (!permissions || !Array.isArray(permissions)) {
        return res.status(400).json({
          success: false,
          message: "Se requiere un array de permisos",
        });
      }

      const result = await RBACService.assignPermissionsToRole(
        roleId,
        permissions
      );

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Obtener permisos disponibles
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAvailablePermissions(req, res) {
    try {
      const permissions = await RBACService.getAvailablePermissions();

      res.json({
        success: true,
        data: permissions,
        message: "Permisos disponibles obtenidos correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Crear un nuevo permiso
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createPermission(req, res) {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: "El nombre del permiso es requerido",
        });
      }

      const permiso = await RBACService.createPermission(nombre);

      res.status(201).json({
        success: true,
        data: permiso,
        message: "Permiso creado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Crear un nuevo privilegio
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createPrivilege(req, res) {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: "El nombre del privilegio es requerido",
        });
      }

      const privilegio = await RBACService.createPrivilege(nombre);

      res.status(201).json({
        success: true,
        data: privilegio,
        message: "Privilegio creado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Obtener estadísticas del sistema RBAC
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getRBACStats(req, res) {
    try {
      const stats = await RBACService.getRBACStats();

      res.json({
        success: true,
        data: stats,
        message: "Estadísticas obtenidas correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Obtener usuarios por rol
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getUsersByRole(req, res) {
    try {
      const { roleId } = req.params;
      const users = await RBACService.getUsersByRole(roleId);

      res.json({
        success: true,
        data: users,
        message: "Usuarios obtenidos correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async checkUserPermission(req, res) {
    try {
      const { userId } = req.params;
      const { permiso, privilegio } = req.query;

      if (!permiso || !privilegio) {
        return res.status(400).json({
          success: false,
          message: "Se requiere permiso y privilegio",
        });
      }

      const hasPermission = await RBACService.hasPermission(
        userId,
        permiso,
        privilegio
      );

      res.json({
        success: true,
        data: {
          userId,
          permiso,
          privilegio,
          hasPermission,
        },
        message: hasPermission
          ? "Usuario tiene el permiso"
          : "Usuario no tiene el permiso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Obtener permisos de un usuario específico
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getUserPermissions(req, res) {
    try {
      const { userId } = req.params;
      const permissions = await RBACService.getUserPermissions(userId);

      res.json({
        success: true,
        data: permissions,
        message: "Permisos del usuario obtenidos correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new RBACController();
