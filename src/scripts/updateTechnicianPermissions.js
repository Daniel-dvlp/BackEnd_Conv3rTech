const sequelize = require('../config/database');
const { Role, Privilege, Permission, RolPermisoPrivilegio } = require('../models/auth/associations');
const { Op } = require('sequelize');

async function updateTechnicianPermissions() {
    try {
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada.');

        const role = await Role.findOne({ where: { nombre_rol: 'Tecnico' } });
        if (!role) throw new Error('Rol Técnico no encontrado');

        // Privilegios a eliminar (ids o nombres)
        // Queremos mantener solo 'ver' (id usually 1, but let's find by name)
        const viewPrivilege = await Privilege.findOne({ where: { nombre_privilegio: 'ver' } });
        
        if (!viewPrivilege) throw new Error('Privilegio ver no encontrado');

        console.log(`🧹 Limpiando permisos para rol: ${role.nombre_rol} (ID: ${role.id_rol})`);
        console.log(`👁️ Manteniendo privilegio: ${viewPrivilege.nombre_privilegio} (ID: ${viewPrivilege.id_privilegio})`);

        // Eliminar todos los registros de este rol que NO sean 'ver'
        const deleted = await RolPermisoPrivilegio.destroy({
            where: {
                id_rol: role.id_rol,
                id_privilegio: { [Op.ne]: viewPrivilege.id_privilegio }
            }
        });

        console.log(`🗑️ Se eliminaron ${deleted} permisos de escritura/edición/eliminación.`);

        // Verificación final
        const remaining = await RolPermisoPrivilegio.findAll({
            where: { id_rol: role.id_rol },
            include: [
                { model: Permission, as: 'permiso' },
                { model: Privilege, as: 'privilegio' }
            ]
        });

        console.log('📋 Permisos actuales del Técnico:');
        remaining.forEach(entry => {
            console.log(`   - ${entry.permiso.nombre_permiso}: ${entry.privilegio.nombre_privilegio}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

updateTechnicianPermissions();
