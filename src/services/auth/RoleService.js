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
      const stripAccents = (s) =>
        norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Mapear nombres de permisos (con y sin acentos) a IDs
      const permissionNameToId = new Map();
      (allPermissions || []).forEach((p) => {
        const n = norm(p.nombre_permiso);
        const na = stripAccents(p.nombre_permiso);
        permissionNameToId.set(n, p.id_permiso);
        permissionNameToId.set(na, p.id_permiso);
      });

      // Mapear nombres de privilegios (con y sin acentos) a IDs
      const privilegeNameToId = new Map();
      (allPrivileges || []).forEach((pr) => {
        const n = norm(pr.nombre_privilegio);
        const na = stripAccents(pr.nombre_privilegio);
        privilegeNameToId.set(n, pr.id_privilegio);
        privilegeNameToId.set(na, pr.id_privilegio);
      });

      const permisosArray = [];
      const warnings = { unknownPermissions: [], unknownPrivileges: [] };

      // Sinónimos y normalización de nombres de permisos (frontend → backend)
      const permSynonyms = new Map([
        ["categoria de productos", "categoría de productos"],
        ["categorias de productos", "categoría de productos"],
        ["categoria de servicios", "categoría de servicios"],
        ["categorias de servicios", "categoría de servicios"],
        ["ordenes de servicio", "órdenes de servicio"],
        ["ordenes de servicios", "órdenes de servicio"],
        ["venta de productos", "venta de productos"],
        ["pagos y abonos", "pagos y abonos"],
        ["programacion laboral", "programación laboral"],
        ["proyectos de servicio", "proyectos de servicio"],
        ["compras", "compras"],
        ["clientes", "clientes"],
        ["proveedores", "proveedores"],
        ["productos", "productos"],
        ["usuarios", "usuarios"],
        ["dashboard", "dashboard"],
      ]);

      // Sinónimos y normalización de nombres de privilegios
      const privSynonyms = new Map([
        ["crear", "crear"],
        ["editar", "editar"],
        ["ver", "ver"],
        ["eliminar", "eliminar"],
        ["anular", "eliminar"], // tratar "Anular" como "Eliminar" si no existe "anular" en backend
        ["crear entrega", "crear_entrega"],
        ["crear_entrega", "crear_entrega"],
      ]);

      for (const [permKey, privNames] of Object.entries(permissionsByName || {})) {
        const keyRaw = typeof permKey === "string" ? permKey : "";
        // Aceptar claves tipo "Módulo.Submódulo" y usar el último segmento como nombre de permiso
        const splitKey = keyRaw.includes(".") ? keyRaw.split(".").pop() : keyRaw;
        const candidates = [norm(splitKey), stripAccents(splitKey)];

        let permId = null;
        for (const cand of candidates) {
          permId = permissionNameToId.get(cand);
          if (permId) break;
          const syn = permSynonyms.get(cand);
          if (syn) {
            const sn = norm(syn);
            const sna = stripAccents(syn);
            permId = permissionNameToId.get(sn) || permissionNameToId.get(sna);
            if (permId) break;
          }
        }

        if (!permId) {
          warnings.unknownPermissions.push(keyRaw);
          continue; // ignorar permisos desconocidos para evitar error
        }

        if (!Array.isArray(privNames) || privNames.length === 0) {
          warnings.unknownPrivileges.push({ permission: keyRaw, detail: "sin privilegios" });
          continue;
        }

        const privilegios = [];
        for (const privName of privNames) {
          const pnRaw = typeof privName === "string" ? privName : "";
          const pnNorm = norm(pnRaw);
          const pnNoAccents = stripAccents(pnRaw);

          let privId =
            privilegeNameToId.get(pnNorm) || privilegeNameToId.get(pnNoAccents);

          if (!privId) {
            const mapped = privSynonyms.get(pnNoAccents) || privSynonyms.get(pnNorm);
            if (mapped) {
              const mappedNorm = norm(mapped);
              const mappedAcc = stripAccents(mapped);
              privId =
                privilegeNameToId.get(mappedNorm) ||
                privilegeNameToId.get(mappedAcc);
            }
          }

          if (!privId) {
            warnings.unknownPrivileges.push({ permission: keyRaw, privilege: pnRaw });
            continue; // ignorar privilegios desconocidos
          }

          privilegios.push({ id_privilegio: privId });
        }

        if (privilegios.length > 0) {
          permisosArray.push({ id_permiso: permId, privilegios });
        } else {
          warnings.unknownPrivileges.push({ permission: keyRaw, detail: "sin privilegios válidos" });
        }
      }

      if (permisosArray.length === 0) {
        throw new Error(
          "No se pudo asignar ningún permiso. Revise nombres y privilegios enviados."
        );
      }

      await roleRepository.assignPermissions(roleId, permisosArray);
      return { assignedCount: permisosArray.length, warnings };
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
