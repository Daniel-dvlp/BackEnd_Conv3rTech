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
      const existing = await roleRepository.findById(id);
      if (!existing) {
        throw new Error("Rol no encontrado");
      }
      // Filtrar a campos válidos del modelo Role
      const { nombre_rol, descripcion, estado } = roleData || {};
      const payload = {};
      if (typeof nombre_rol !== "undefined") payload.nombre_rol = nombre_rol;
      if (typeof descripcion !== "undefined") payload.descripcion = descripcion;
      if (typeof estado !== "undefined") payload.estado = estado;

      // Intentar actualizar (idempotente: si no hay cambios, seguimos)
      await roleRepository.update(id, payload);
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

  async assignPermissionsFromNames(roleId, permissionsByName) {
    try {
      // Obtener permisos y privilegios disponibles para mapear nombres a IDs
      const [allPermissions, allPrivileges] = await Promise.all([
        permissionRepository.findAllPermissions(),
        permissionRepository.findAllPrivileges(),
      ]);

      const norm = (s) => (typeof s === "string" ? s.trim().toLowerCase() : "");

      const permissionNameToId = new Map(
        (allPermissions || []).map((p) => [norm(p.nombre_permiso), p.id_permiso])
      );
      const privilegeNameToId = new Map(
        (allPrivileges || []).map((pr) => [norm(pr.nombre_privilegio), pr.id_privilegio])
      );

      const permisosArray = [];
      for (const [permName, privNames] of Object.entries(permissionsByName || {})) {
        const permId = permissionNameToId.get(norm(permName));
        if (!permId) {
          throw new Error(`Permiso desconocido: '${permName}'`);
        }
        if (!Array.isArray(privNames) || privNames.length === 0) {
          throw new Error(`El permiso '${permName}' debe incluir al menos un privilegio`);
        }
        const privilegios = privNames.map((privName) => {
          const privId = privilegeNameToId.get(norm(privName));
          if (!privId) {
            throw new Error(`Privilegio desconocido: '${privName}'`);
          }
          return { id_privilegio: privId };
        });

        permisosArray.push({ id_permiso: permId, privilegios });
      }

      await roleRepository.assignPermissions(roleId, permisosArray);
      return true;
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

  // Métodos para CRUD de privilegios
  async createPrivilege(privilegeData) {
    try {
      return await permissionRepository.createPrivilege(privilegeData);
    } catch (error) {
      throw error;
    }
  }

  async getPrivilegeById(id) {
    try {
      const privilege = await permissionRepository.findPrivilegeById(id);
      if (!privilege) {
        throw new Error("Privilegio no encontrado");
      }
      return privilege;
    } catch (error) {
      throw error;
    }
  }

  async updatePrivilege(id, privilegeData) {
    try {
      const updated = await permissionRepository.updatePrivilege(
        id,
        privilegeData
      );
      if (!updated) {
        throw new Error("No se pudo actualizar el privilegio");
      }
      return await permissionRepository.findPrivilegeById(id);
    } catch (error) {
      throw error;
    }
  }

  async deletePrivilege(id) {
    try {
      const deleted = await permissionRepository.deletePrivilege(id);
      if (!deleted) {
        throw new Error("No se pudo eliminar el privilegio");
      }
      return true;
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
