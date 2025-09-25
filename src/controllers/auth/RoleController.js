const { validationResult } = require("express-validator");
const roleService = require("../../services/auth/RoleService");

class RoleController {
  async getAllRoles(req, res) {
    try {
      const roles = await roleService.getAllRoles();

      res.status(200).json({
        success: true,
        data: roles,
        message: "Roles obtenidos exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);

      res.status(200).json({
        success: true,
        data: role,
        message: "Rol obtenido exitosamente",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const role = await roleService.createRole(req.body);

      res.status(201).json({
        success: true,
        data: role,
        message: "Rol creado exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const role = await roleService.updateRole(id, req.body);

      res.status(200).json({
        success: true,
        data: role,
        message: "Rol actualizado exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      await roleService.deleteRole(id);

      res.status(200).json({
        success: true,
        message: "Rol eliminado exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async assignPermissionsToRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { permisos } = req.body;

      await roleService.assignPermissionsToRole(id, permisos);

      res.status(200).json({
        success: true,
        message: "Permisos asignados al rol exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getRolePermissions(req, res) {
    try {
      const { id } = req.params;
      const permissions = await roleService.getRolePermissions(id);

      res.status(200).json({
        success: true,
        data: permissions,
        message: "Permisos del rol obtenidos exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPermissions(req, res) {
    try {
      const permissions = await roleService.getAllPermissions();

      res.status(200).json({
        success: true,
        data: permissions,
        message: "Permisos obtenidos exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPrivileges(req, res) {
    try {
      const privileges = await roleService.getAllPrivileges();

      res.status(200).json({
        success: true,
        data: privileges,
        message: "Privilegios obtenidos exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Métodos para CRUD de privilegios
  async createPrivilege(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const privilegeData = req.body;
      const privilege = await roleService.createPrivilege(privilegeData);

      res.status(201).json({
        success: true,
        message: "Privilegio creado exitosamente",
        data: privilege,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPrivilegeById(req, res) {
    try {
      const { id } = req.params;
      const privilege = await roleService.getPrivilegeById(id);

      res.status(200).json({
        success: true,
        data: privilege,
        message: "Privilegio obtenido exitosamente",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePrivilege(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const privilegeData = req.body;
      const privilege = await roleService.updatePrivilege(id, privilegeData);

      res.status(200).json({
        success: true,
        message: "Privilegio actualizado exitosamente",
        data: privilege,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deletePrivilege(req, res) {
    try {
      const { id } = req.params;
      await roleService.deletePrivilege(id);

      res.status(200).json({
        success: true,
        message: "Privilegio eliminado exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Métodos para CRUD de permisos
  async createPermission(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const permissionData = req.body;
      const permission = await roleService.createPermission(permissionData);

      res.status(201).json({
        success: true,
        message: "Permiso creado exitosamente",
        data: permission,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPermissionById(req, res) {
    try {
      const { id } = req.params;
      const permission = await roleService.getPermissionById(id);

      res.status(200).json({
        success: true,
        data: permission,
        message: "Permiso obtenido exitosamente",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePermission(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const permissionData = req.body;
      const permission = await roleService.updatePermission(id, permissionData);

      res.status(200).json({
        success: true,
        message: "Permiso actualizado exitosamente",
        data: permission,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deletePermission(req, res) {
    try {
      const { id } = req.params;
      await roleService.deletePermission(id);

      res.status(200).json({
        success: true,
        message: "Permiso eliminado exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new RoleController();
