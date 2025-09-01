const roleRepository = require("../../repositories/auth/RoleRepository");
const permissionRepository = require("../../repositories/auth/PermissionRepository");

class RoleService {
  async getAllRoles() {
    try {
      return await roleRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id) {
    try {
      const role = await roleRepository.findById(id);
      if (!role) {
        throw new Error("Rol no encontrado");
      }
      return role;
    } catch (error) {
      throw error;
    }
  }

  async createRole(roleData) {
    try {
      return await roleRepository.create(roleData);
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id, roleData) {
    try {
      const updated = await roleRepository.update(id, roleData);
      if (!updated) {
        throw new Error("No se pudo actualizar el rol");
      }
      return await roleRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id) {
    try {
      const deleted = await roleRepository.delete(id);
      if (!deleted) {
        throw new Error("No se pudo eliminar el rol");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async assignPermissionsToRole(roleId, permissions) {
    try {
      return await roleRepository.assignPermissions(roleId, permissions);
    } catch (error) {
      throw error;
    }
  }

  async getRolePermissions(roleId) {
    try {
      return await roleRepository.getRolePermissions(roleId);
    } catch (error) {
      throw error;
    }
  }

  async getAllPermissions() {
    try {
      return await permissionRepository.findAllPermissions();
    } catch (error) {
      throw error;
    }
  }

  async getAllPrivileges() {
    try {
      return await permissionRepository.findAllPrivileges();
    } catch (error) {
      throw error;
    }
  }

  // Métodos para CRUD de permisos
  async createPermission(permissionData) {
    try {
      return await permissionRepository.createPermission(permissionData);
    } catch (error) {
      throw error;
    }
  }

  async getPermissionById(id) {
    try {
      const permission = await permissionRepository.findPermissionById(id);
      if (!permission) {
        throw new Error("Permiso no encontrado");
      }
      return permission;
    } catch (error) {
      throw error;
    }
  }

  async updatePermission(id, permissionData) {
    try {
      const updated = await permissionRepository.updatePermission(
        id,
        permissionData
      );
      if (!updated) {
        throw new Error("No se pudo actualizar el permiso");
      }
      return await permissionRepository.findPermissionById(id);
    } catch (error) {
      throw error;
    }
  }

  async deletePermission(id) {
    try {
      const deleted = await permissionRepository.deletePermission(id);
      if (!deleted) {
        throw new Error("No se pudo eliminar el permiso");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RoleService();
