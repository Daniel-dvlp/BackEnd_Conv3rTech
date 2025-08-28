const { validationResult } = require('express-validator');
const RolesService = require('../../services/auth/RolesService');

class RolesController {
    // ==================== ROLES ====================
    
    /**
     * Crear un nuevo rol
     * POST /api/roles
     */
    async createRole(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const role = await RolesService.createRole(req.body);
            
            return res.status(201).json({
                success: true,
                message: 'Rol creado exitosamente',
                data: role
            });
        } catch (error) {
            console.error('Error creando rol:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Obtener todos los roles
     * GET /api/roles
     */
    async getAllRoles(req, res) {
        try {
            const roles = await RolesService.getAllRoles();
            
            return res.status(200).json({
                success: true,
                message: 'Roles obtenidos exitosamente',
                data: roles
            });
        } catch (error) {
            console.error('Error obteniendo roles:', error);
            return res.status(500).json({
                success: false,
                message: 'Error obteniendo roles'
            });
        }
    }

    /**
     * Obtener un rol por ID
     * GET /api/roles/:id
     */
    async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const role = await RolesService.getRoleById(id);
            
            return res.status(200).json({
                success: true,
                message: 'Rol obtenido exitosamente',
                data: role
            });
        } catch (error) {
            console.error('Error obteniendo rol:', error);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Actualizar un rol
     * PUT /api/roles/:id
     */
    async updateRole(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const role = await RolesService.updateRole(id, req.body);
            
            return res.status(200).json({
                success: true,
                message: 'Rol actualizado exitosamente',
                data: role
            });
        } catch (error) {
            console.error('Error actualizando rol:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Eliminar un rol
     * DELETE /api/roles/:id
     */
    async deleteRole(req, res) {
        try {
            const { id } = req.params;
            await RolesService.deleteRole(id);
            
            return res.status(200).json({
                success: true,
                message: 'Rol eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando rol:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ==================== PERMISOS ====================
    
    /**
     * Crear un nuevo permiso
     * POST /api/permissions
     */
    async createPermission(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const permission = await RolesService.createPermission(req.body);
            
            return res.status(201).json({
                success: true,
                message: 'Permiso creado exitosamente',
                data: permission
            });
        } catch (error) {
            console.error('Error creando permiso:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Obtener todos los permisos
     * GET /api/permissions
     */
    async getAllPermissions(req, res) {
        try {
            const permissions = await RolesService.getAllPermissions();
            
            return res.status(200).json({
                success: true,
                message: 'Permisos obtenidos exitosamente',
                data: permissions
            });
        } catch (error) {
            console.error('Error obteniendo permisos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error obteniendo permisos'
            });
        }
    }

    /**
     * Obtener un permiso por ID
     * GET /api/permissions/:id
     */
    async getPermissionById(req, res) {
        try {
            const { id } = req.params;
            const permission = await RolesService.getPermissionById(id);
            
            return res.status(200).json({
                success: true,
                message: 'Permiso obtenido exitosamente',
                data: permission
            });
        } catch (error) {
            console.error('Error obteniendo permiso:', error);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Actualizar un permiso
     * PUT /api/permissions/:id
     */
    async updatePermission(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const permission = await RolesService.updatePermission(id, req.body);
            
            return res.status(200).json({
                success: true,
                message: 'Permiso actualizado exitosamente',
                data: permission
            });
        } catch (error) {
            console.error('Error actualizando permiso:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Eliminar un permiso
     * DELETE /api/permissions/:id
     */
    async deletePermission(req, res) {
        try {
            const { id } = req.params;
            await RolesService.deletePermission(id);
            
            return res.status(200).json({
                success: true,
                message: 'Permiso eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando permiso:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ==================== PRIVILEGIOS ====================
    
    /**
     * Crear un nuevo privilegio
     * POST /api/privileges
     */
    async createPrivilege(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const privilege = await RolesService.createPrivilege(req.body);
            
            return res.status(201).json({
                success: true,
                message: 'Privilegio creado exitosamente',
                data: privilege
            });
        } catch (error) {
            console.error('Error creando privilegio:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Obtener todos los privilegios
     * GET /api/privileges
     */
    async getAllPrivileges(req, res) {
        try {
            const privileges = await RolesService.getAllPrivileges();
            
            return res.status(200).json({
                success: true,
                message: 'Privilegios obtenidos exitosamente',
                data: privileges
            });
        } catch (error) {
            console.error('Error obteniendo privilegios:', error);
            return res.status(500).json({
                success: false,
                message: 'Error obteniendo privilegios'
            });
        }
    }

    /**
     * Obtener un privilegio por ID
     * GET /api/privileges/:id
     */
    async getPrivilegeById(req, res) {
        try {
            const { id } = req.params;
            const privilege = await RolesService.getPrivilegeById(id);
            
            return res.status(200).json({
                success: true,
                message: 'Privilegio obtenido exitosamente',
                data: privilege
            });
        } catch (error) {
            console.error('Error obteniendo privilegio:', error);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Actualizar un privilegio
     * PUT /api/privileges/:id
     */
    async updatePrivilege(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const privilege = await RolesService.updatePrivilege(id, req.body);
            
            return res.status(200).json({
                success: true,
                message: 'Privilegio actualizado exitosamente',
                data: privilege
            });
        } catch (error) {
            console.error('Error actualizando privilegio:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Eliminar un privilegio
     * DELETE /api/privileges/:id
     */
    async deletePrivilege(req, res) {
        try {
            const { id } = req.params;
            await RolesService.deletePrivilege(id);
            
            return res.status(200).json({
                success: true,
                message: 'Privilegio eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando privilegio:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ==================== ASIGNACIONES DE PERMISOS ====================
    
    /**
     * Asignar permiso a un rol
     * POST /api/roles/:roleId/permissions
     */
    async assignPermissionToRole(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { roleId } = req.params;
            const { permissionId, privilegeId } = req.body;
            
            const result = await RolesService.assignPermissionToRole(roleId, permissionId, privilegeId);
            
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            console.error('Error asignando permiso:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Remover permiso de un rol
     * DELETE /api/roles/:roleId/permissions
     */
    async removePermissionFromRole(req, res) {
        try {
            const { roleId } = req.params;
            const { permissionId, privilegeId } = req.body;
            
            const result = await RolesService.removePermissionFromRole(roleId, permissionId, privilegeId);
            
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            console.error('Error removiendo permiso:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Obtener permisos de un rol
     * GET /api/roles/:roleId/permissions
     */
    async getRolePermissions(req, res) {
        try {
            const { roleId } = req.params;
            const permissions = await RolesService.getRolePermissions(roleId);
            
            return res.status(200).json({
                success: true,
                message: 'Permisos del rol obtenidos exitosamente',
                data: permissions
            });
        } catch (error) {
            console.error('Error obteniendo permisos del rol:', error);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Asignar múltiples permisos a un rol
     * POST /api/roles/:roleId/permissions/bulk
     */
    async bulkAssignPermissions(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { roleId } = req.params;
            const { permissions } = req.body;
            
            await RolesService.bulkAssignPermissions(roleId, permissions);
            
            return res.status(200).json({
                success: true,
                message: 'Permisos asignados exitosamente'
            });
        } catch (error) {
            console.error('Error asignando permisos:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ==================== ESTADOS DE USUARIO ====================
    
    /**
     * Obtener todos los estados de usuario
     * GET /api/user-states
     */
    async getAllUserStates(req, res) {
        try {
            const states = await RolesService.getAllUserStates();
            
            return res.status(200).json({
                success: true,
                message: 'Estados de usuario obtenidos exitosamente',
                data: states
            });
        } catch (error) {
            console.error('Error obteniendo estados de usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error obteniendo estados de usuario'
            });
        }
    }

    /**
     * Crear un nuevo estado de usuario
     * POST /api/user-states
     */
    async createUserState(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const state = await RolesService.createUserState(req.body);
            
            return res.status(201).json({
                success: true,
                message: 'Estado de usuario creado exitosamente',
                data: state
            });
        } catch (error) {
            console.error('Error creando estado de usuario:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ==================== CONSULTAS ESPECIALES ====================
    
    /**
     * Obtener roles con sus permisos
     * GET /api/roles-with-permissions
     */
    async getRolesWithPermissions(req, res) {
        try {
            const roles = await RolesService.getRolesWithPermissions();
            
            return res.status(200).json({
                success: true,
                message: 'Roles con permisos obtenidos exitosamente',
                data: roles
            });
        } catch (error) {
            console.error('Error obteniendo roles con permisos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error obteniendo roles con permisos'
            });
        }
    }

    /**
     * Obtener resumen de permisos
     * GET /api/permissions-summary
     */
    async getPermissionsSummary(req, res) {
        try {
            const summary = await RolesService.getPermissionsSummary();
            
            return res.status(200).json({
                success: true,
                message: 'Resumen de permisos obtenido exitosamente',
                data: summary
            });
        } catch (error) {
            console.error('Error obteniendo resumen de permisos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error obteniendo resumen de permisos'
            });
        }
    }
}

module.exports = new RolesController();
