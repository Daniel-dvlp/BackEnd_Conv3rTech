const sequelize = require('../config/database');
const { Role, Privilege, Permission } = require('../models/auth/associations');

async function checkRolePrivileges() {
    try {
        await sequelize.authenticate();
        
        const role = await Role.findOne({ 
            where: { nombre_rol: 'Tecnico' },
            include: [{
                model: Permission,
                as: 'permisos',
                include: [{
                    model: Privilege,
                    as: 'privilegios'
                }]
            }]
        });

        if (role) {
            console.log(`Rol: ${role.nombre_rol}`);
            role.permisos.forEach(permiso => {
                // This structure might be complex because it's a 3-way join.
                // The 'permisos' include gives us modules the role has access to.
                // But to get the specific privileges for THAT module for THAT role, we need to query the pivot.
                // Or rely on the fact that Sequelize M:N with extra columns is tricky.
            });
            
            // Better approach: Query the pivot table directly
            const { RolPermisoPrivilegio } = require('../models/auth/associations');
            const pivotEntries = await RolPermisoPrivilegio.findAll({
                where: { id_rol: role.id_rol },
                include: [
                    { model: Permission, as: 'permiso' },
                    { model: Privilege, as: 'privilegio' }
                ]
            });

            pivotEntries.forEach(entry => {
                console.log(`- Modulo: ${entry.permiso.nombre_permiso} -> Privilegio: ${entry.privilegio.nombre_privilegio}`);
            });

        } else {
            console.log('Rol Tecnico no encontrado');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

checkRolePrivileges();
