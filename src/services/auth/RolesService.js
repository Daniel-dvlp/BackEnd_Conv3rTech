const RolesRepository = require('../../repositories/auth/RolesRepository');

class RolesService {
    // ==================== ROLES ====================
    async createRole(roleData) {
        try {
            // Validar que el nombre del rol no exista
            const existingRole = await RolesRepository.getRoleByName(roleData.nombre_rol);
            if (existingRole) {
                throw new Error('Ya existe un rol con ese nombre');
            }

            return await RolesRepository.createRole(roleData);
        } catch (error) {
            throw error;
        }
    }

    async getAllRoles() {
        try {
            return await RolesRepository.getAllRoles();
        } catch (error) {
            throw error;
        }
    }

    async getRoleById(id) {
        try {
            const role = await RolesRepository.getRoleById(id);
            if (!role) {
                throw new Error('Rol no encontrado');
            }
            return role;
        } catch (error) {
            throw error;
        }
    }

    async updateRole(id, roleData) {
        try {
            // Verificar que el rol existe
            const existingRole = await RolesRepository.getRoleById(id);
            if (!existingRole) {
                throw new Error('Rol no encontrado');
            }

            // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
            if (roleData.nombre_rol && roleData.nombre_rol !== existingRole.nombre_rol) {
                const roleWithSameName = await RolesRepository.getRoleByName(roleData.nombre_rol);
                if (roleWithSameName) {
                    throw new Error('Ya existe un rol con ese nombre');
                }
            }

            const [updated] = await RolesRepository.updateRole(id, roleData);
            if (updated === 0) {
                throw new Error('No se pudo actualizar el rol');
            }

            return await RolesRepository.getRoleById(id);
        } catch (error) {
            throw error;
        }
    }

    async deleteRole(id) {
        try {
            // Verificar que el rol existe
            const existingRole = await RolesRepository.getRoleById(id);
            if (!existingRole) {
                throw new Error('Rol no encontrado');
            }

            // Verificar que no haya usuarios asignados a este rol
            const { Users } = require('../../models/associations');
            const usersWithRole = await Users.count({ where: { id_rol: id } });
            if (usersWithRole > 0) {
                throw new Error(`No se puede eliminar el rol porque tiene ${usersWithRole} usuario(s) asignado(s)`);
            }

            const [deleted] = await RolesRepository.deleteRole(id);
            if (deleted === 0) {
                throw new Error('No se pudo eliminar el rol');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // ==================== PERMISOS ====================
    async createPermission(permissionData) {
        try {
            // Validar que el nombre del permiso no exista
            const existingPermission = await RolesRepository.getPermissionByName(permissionData.nombre_permiso);
            if (existingPermission) {
                throw new Error('Ya existe un permiso con ese nombre');
            }

            return await RolesRepository.createPermission(permissionData);
        } catch (error) {
            throw error;
        }
    }

    async getAllPermissions() {
        try {
            return await RolesRepository.getAllPermissions();
        } catch (error) {
            throw error;
        }
    }

    async getPermissionById(id) {
        try {
            const permission = await RolesRepository.getPermissionById(id);
            if (!permission) {
                throw new Error('Permiso no encontrado');
            }
            return permission;
        } catch (error) {
            throw error;
        }
    }

    async updatePermission(id, permissionData) {
        try {
            // Verificar que el permiso existe
            const existingPermission = await RolesRepository.getPermissionById(id);
            if (!existingPermission) {
                throw new Error('Permiso no encontrado');
            }

            // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
            if (permissionData.nombre_permiso && permissionData.nombre_permiso !== existingPermission.nombre_permiso) {
                const permissionWithSameName = await RolesRepository.getPermissionByName(permissionData.nombre_permiso);
                if (permissionWithSameName) {
                    throw new Error('Ya existe un permiso con ese nombre');
                }
            }

            const [updated] = await RolesRepository.updatePermission(id, permissionData);
            if (updated === 0) {
                throw new Error('No se pudo actualizar el permiso');
            }

            return await RolesRepository.getPermissionById(id);
        } catch (error) {
            throw error;
        }
    }

    async deletePermission(id) {
        try {
            // Verificar que el permiso existe
            const existingPermission = await RolesRepository.getPermissionById(id);
            if (!existingPermission) {
                throw new Error('Permiso no encontrado');
            }

            // Verificar que no haya roles que usen este permiso
            const { RolPermisoPrivilegio } = require('../../models/associations');
            const rolesUsingPermission = await RolPermisoPrivilegio.count({ where: { id_permiso: id } });
            if (rolesUsingPermission > 0) {
                throw new Error(`No se puede eliminar el permiso porque está asignado a ${rolesUsingPermission} rol(es)`);
            }

            const deleted = await RolesRepository.deletePermission(id);
            if (deleted === 0) {
                throw new Error('No se pudo eliminar el permiso');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // ==================== PRIVILEGIOS ====================
    async createPrivilege(privilegeData) {
        try {
            // Validar que el nombre del privilegio no exista
            const existingPrivilege = await RolesRepository.getPrivilegeByName(privilegeData.nombre_privilegio);
            if (existingPrivilege) {
                throw new Error('Ya existe un privilegio con ese nombre');
            }

            return await RolesRepository.createPrivilege(privilegeData);
        } catch (error) {
            throw error;
        }
    }

    async getAllPrivileges() {
        try {
            return await RolesRepository.getAllPrivileges();
        } catch (error) {
            throw error;
        }
    }

    async getPrivilegeById(id) {
        try {
            const privilege = await RolesRepository.getPrivilegeById(id);
            if (!privilege) {
                throw new Error('Privilegio no encontrado');
            }
            return privilege;
        } catch (error) {
            throw error;
        }
    }

    async updatePrivilege(id, privilegeData) {
        try {
            // Verificar que el privilegio existe
            const existingPrivilege = await RolesRepository.getPrivilegeById(id);
            if (!existingPrivilege) {
                throw new Error('Privilegio no encontrado');
            }

            // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
            if (privilegeData.nombre_privilegio && privilegeData.nombre_privilegio !== existingPrivilege.nombre_privilegio) {
                const privilegeWithSameName = await RolesRepository.getPrivilegeByName(privilegeData.nombre_privilegio);
                if (privilegeWithSameName) {
                    throw new Error('Ya existe un privilegio con ese nombre');
                }
            }

            const [updated] = await RolesRepository.updatePrivilege(id, privilegeData);
            if (updated === 0) {
                throw new Error('No se pudo actualizar el privilegio');
            }

            return await RolesRepository.getPrivilegeById(id);
        } catch (error) {
            throw error;
        }
    }

    async deletePrivilege(id) {
        try {
            // Verificar que el privilegio existe
            const existingPrivilege = await RolesRepository.getPrivilegeById(id);
            if (!existingPrivilege) {
                throw new Error('Privilegio no encontrado');
            }

            // Verificar que no haya roles que usen este privilegio
            const { RolPermisoPrivilegio } = require('../../models/associations');
            const rolesUsingPrivilege = await RolPermisoPrivilegio.count({ where: { id_privilegio: id } });
            if (rolesUsingPrivilege > 0) {
                throw new Error(`No se puede eliminar el privilegio porque está asignado a ${rolesUsingPrivilege} rol(es)`);
            }

            const deleted = await RolesRepository.deletePrivilege(id);
            if (deleted === 0) {
                throw new Error('No se pudo eliminar el privilegio');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // ==================== ASIGNACIONES DE PERMISOS ====================
    async assignPermissionToRole(roleId, permissionId, privilegeId) {
        try {
            // Verificar que el rol existe
            const role = await RolesRepository.getRoleById(roleId);
            if (!role) {
                throw new Error('Rol no encontrado');
            }

            // Verificar que el permiso existe
            const permission = await RolesRepository.getPermissionById(permissionId);
            if (!permission) {
                throw new Error('Permiso no encontrado');
            }

            // Verificar que el privilegio existe
            const privilege = await RolesRepository.getPrivilegeById(privilegeId);
            if (!privilege) {
                throw new Error('Privilegio no encontrado');
            }

            const [assignment, created] = await RolesRepository.assignPermissionToRole(roleId, permissionId, privilegeId);
            
            return {
                assignment,
                created,
                message: created ? 'Permiso asignado exitosamente' : 'El permiso ya estaba asignado'
            };
        } catch (error) {
            throw error;
        }
    }

    async removePermissionFromRole(roleId, permissionId, privilegeId) {
        try {
            // Verificar que el rol existe
            const role = await RolesRepository.getRoleById(roleId);
            if (!role) {
                throw new Error('Rol no encontrado');
            }

            const deleted = await RolesRepository.removePermissionFromRole(roleId, permissionId, privilegeId);
            
            if (deleted === 0) {
                throw new Error('No se encontró la asignación de permiso para eliminar');
            }

            return {
                deleted,
                message: 'Permiso removido exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    async getRolePermissions(roleId) {
        try {
            // Verificar que el rol existe
            const role = await RolesRepository.getRoleById(roleId);
            if (!role) {
                throw new Error('Rol no encontrado');
            }

            return await RolesRepository.getRolePermissions(roleId);
        } catch (error) {
            throw error;
        }
    }

    async bulkAssignPermissions(roleId, permissions) {
        try {
            // Verificar que el rol existe
            const role = await RolesRepository.getRoleById(roleId);
            if (!role) {
                throw new Error('Rol no encontrado');
            }

            // Validar estructura de permisos
            if (!permissions || typeof permissions !== 'object') {
                throw new Error('Formato de permisos inválido');
            }

            return await RolesRepository.bulkAssignPermissions(roleId, permissions);
        } catch (error) {
            throw error;
        }
    }

    // ==================== ESTADOS DE USUARIO ====================
    async getAllUserStates() {
        try {
            return await RolesRepository.getAllUserStates();
        } catch (error) {
            throw error;
        }
    }

    async createUserState(stateData) {
        try {
            // Validar que el estado no exista
            const existingState = await RolesRepository.getAllUserStates();
            const stateExists = existingState.some(state => 
                state.estado.toLowerCase() === stateData.estado.toLowerCase()
            );
            
            if (stateExists) {
                throw new Error('Ya existe un estado con ese nombre');
            }

            return await RolesRepository.createUserState(stateData);
        } catch (error) {
            throw error;
        }
    }

    async updateUserState(id, stateData) {
        try {
            // Verificar que el estado existe
            const existingState = await RolesRepository.getUserStateById(id);
            if (!existingState) {
                throw new Error('Estado no encontrado');
            }

            const [updated] = await RolesRepository.updateUserState(id, stateData);
            if (updated === 0) {
                throw new Error('No se pudo actualizar el estado');
            }

            return await RolesRepository.getUserStateById(id);
        } catch (error) {
            throw error;
        }
    }

    async deleteUserState(id) {
        try {
            // Verificar que el estado existe
            const existingState = await RolesRepository.getUserStateById(id);
            if (!existingState) {
                throw new Error('Estado no encontrado');
            }

            // Verificar que no haya usuarios con este estado
            const { Users } = require('../../models/associations');
            const usersWithState = await Users.count({ where: { id_estado_usuario: id } });
            if (usersWithState > 0) {
                throw new Error(`No se puede eliminar el estado porque tiene ${usersWithState} usuario(s) asignado(s)`);
            }

            const deleted = await RolesRepository.deleteUserState(id);
            if (deleted === 0) {
                throw new Error('No se pudo eliminar el estado');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // ==================== CONSULTAS ESPECIALES ====================
    async getRolesWithPermissions() {
        try {
            return await RolesRepository.getRolesWithPermissions();
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsSummary() {
        try {
            return await RolesRepository.getPermissionsSummary();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RolesService();
