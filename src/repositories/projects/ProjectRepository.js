const {
  Project,
  ProjectSede,
  ProjectMaterial,
  ProjectServicio,
  ProjectEmpleado,
  SalidaMaterial,
  SedeMaterial,
  SedeServicio,
} = require("../../models/projects/associations");
const { Op } = require("sequelize");

class ProjectRepository {
  // Obtener todos los proyectos con sus relaciones
  async getAllProjects(filters = {}) {
    const whereClause = {};

    if (filters.search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${filters.search}%` } },
        { numero_contrato: { [Op.like]: `%${filters.search}%` } },
        { "$cliente.nombre$": { [Op.like]: `%${filters.search}%` } },
        { "$responsable.nombre$": { [Op.like]: `%${filters.search}%` } },
        { "$responsable.apellido$": { [Op.like]: `%${filters.search}%` } },
        { estado: { [Op.like]: `%${filters.search}%` } },
        { prioridad: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    if (filters.estado) {
      whereClause.estado = filters.estado;
    }

    if (filters.prioridad) {
      whereClause.prioridad = filters.prioridad;
    }

    // Filtro de robustez para usuarios técnicos
    // Busca proyectos donde el usuario es responsable O está en la lista de empleados asociados
    if (filters.usuarioAsignadoId) {
      whereClause[Op.and] = [
        ...(whereClause[Op.and] || []),
        {
          [Op.or]: [
            { id_responsable: filters.usuarioAsignadoId },
            { '$empleadosAsociados.id_usuario$': filters.usuarioAsignadoId }
          ]
        }
      ];
    }

    return Project.findAll({
      attributes: { exclude: ["id_cotizacion"] },
      where: whereClause,
      include: [
        {
          model: require("../../models/clients/Clients"),
          as: "cliente",
          attributes: ["id_cliente", "nombre", "documento"],
        },
        {
          model: require("../../models/users/Users"),
          as: "responsable",
          attributes: ["id_usuario", "nombre", "apellido"],
        },
        {
          model: ProjectSede,
          as: "sedes",
          include: [
            {
              model: SedeMaterial,
              as: "materialesAsignados",
              include: [
                {
                  model: require("../../models/products/Product"),
                  as: "producto",
                  attributes: ["id_producto", "nombre", "precio"],
                },
              ],
            },
            {
              model: SedeServicio,
              as: "serviciosAsignados",
              include: [
                {
                  model: require("../../models/services/Service"),
                  as: "servicio",
                  attributes: ["id_servicio", "nombre", "precio"],
                  include: [
                    {
                      model: require("../../models/services_categories/ServiceCategory"),
                      as: "categoria",
                      attributes: ["id", "nombre", "descripcion"],
                    },
                  ],
                  include: [
                    {
                      model: require("../../models/services_categories/ServiceCategory"),
                      as: "categoria",
                      attributes: ["id", "nombre", "descripcion"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: ProjectMaterial,
          as: "materiales",
          include: [
            {
              model: require("../../models/products/Product"),
              as: "producto",
              attributes: ["id_producto", "nombre", "precio", "stock"],
            },
          ],
        },
        {
          model: ProjectServicio,
          as: "servicios",
          include: [
            {
              model: require("../../models/services/Service"),
              as: "servicio",
              attributes: ["id_servicio", "nombre", "precio"],
            },
          ],
        },
        {
          model: ProjectEmpleado,
          as: "empleadosAsociados",
          include: [
            {
              model: require("../../models/users/Users"),
              as: "empleado",
              attributes: ["id_usuario", "nombre", "apellido"],
            },
          ],
        },
      ],
      order: [["fecha_creacion", "DESC"]],
    });
  }

  // Búsqueda rápida por número de contrato, nombre de proyecto o nombre de cliente
  async quickSearch(term, { limit = 10 } = {}) {
    const whereClause = {
      [Op.or]: [
        { nombre: { [Op.like]: `%${term}%` } },
        { numero_contrato: { [Op.like]: `%${term}%` } },
        { "$cliente.nombre$": { [Op.like]: `%${term}%` } },
      ],
    };

    return Project.findAll({
      where: whereClause,
      include: [
        {
          model: require("../../models/clients/Clients"),
          as: "cliente",
          attributes: ["id_cliente", "nombre"],
        },
      ],
      order: [["fecha_creacion", "DESC"]],
      limit,
    });
  }

  // Obtener un proyecto por ID
  async getProjectById(id, transaction = null) {
    return Project.findByPk(id, {
      attributes: { exclude: ["id_cotizacion"] },
      transaction,
      include: [
        {
          model: require("../../models/clients/Clients"),
          as: "cliente",
          attributes: ["id_cliente", "nombre", "documento"],
        },
        {
          model: require("../../models/users/Users"),
          as: "responsable",
          attributes: ["id_usuario", "nombre", "apellido"],
        },
        {
          model: ProjectSede,
          as: "sedes",
          include: [
            {
              model: SedeMaterial,
              as: "materialesAsignados",
              include: [
                {
                  model: require("../../models/products/Product"),
                  as: "producto",
                  attributes: ["id_producto", "nombre", "precio"],
                },
              ],
            },
            {
              model: SedeServicio,
              as: "serviciosAsignados",
              include: [
                {
                  model: require("../../models/services/Service"),
                  as: "servicio",
                  attributes: ["id_servicio", "nombre", "precio"],
                  include: [
                    {
                      model: require("../../models/services_categories/ServiceCategory"),
                      as: "categoria",
                      attributes: ["id", "nombre", "descripcion"],
                    },
                  ],
                  include: [
                    {
                      model: require("../../models/services_categories/ServiceCategory"),
                      as: "categoria",
                      attributes: ["id", "nombre", "descripcion"],
                    },
                  ],
                },
              ],
            },
            {
              model: SalidaMaterial,
              as: "salidasMaterial",
              include: [
                {
                  model: require("../../models/products/Product"),
                  as: "producto",
                  attributes: ["id_producto", "nombre"],
                },
                {
                  model: require("../../models/users/Users"),
                  as: "entregador",
                  attributes: ["id_usuario", "nombre", "apellido"],
                },
              ],
            },
          ],
        },
        {
          model: ProjectMaterial,
          as: "materiales",
          include: [
            {
              model: require("../../models/products/Product"),
              as: "producto",
              attributes: ["id_producto", "nombre", "precio", "stock"],
            },
          ],
        },
        {
          model: ProjectServicio,
          as: "servicios",
          include: [
            {
              model: require("../../models/services/Service"),
              as: "servicio",
              attributes: ["id_servicio", "nombre", "precio"],
            },
          ],
        },
        {
          model: ProjectEmpleado,
          as: "empleadosAsociados",
          include: [
            {
              model: require("../../models/users/Users"),
              as: "empleado",
              attributes: ["id_usuario", "nombre", "apellido"],
            },
          ],
        },
        {
          model: SalidaMaterial,
          as: "salidasMaterial",
          include: [
            {
              model: require("../../models/products/Product"),
              as: "producto",
              attributes: ["id_producto", "nombre"],
            },
            {
              model: require("../../models/users/Users"),
              as: "entregador",
              attributes: ["id_usuario", "nombre", "apellido"],
            },
            {
              model: ProjectSede,
              as: "sede",
              attributes: ["id_proyecto_sede", "nombre"],
            },
          ],
        },
      ],
    });
  }

  // Crear un nuevo proyecto
  async createProject(projectData, transaction = null) {
    console.error(`[DEBUG-V3] [ProjectRepository] createProject called for client ${projectData.id_cliente}, quote ${projectData.id_cotizacion}`);
    const t = transaction || await Project.sequelize.transaction();

    try {
      // Crear el proyecto principal
      const projectDataToCreate = {
        numero_contrato: projectData.numero_contrato,
        nombre: projectData.nombre,
        id_cliente: projectData.id_cliente,
        id_cotizacion: projectData.id_cotizacion,
        fecha_inicio: projectData.fecha_inicio,
        fecha_fin: projectData.fecha_fin,
        estado: projectData.estado,
        progreso: projectData.progreso || 0,
        prioridad: projectData.prioridad,
        ubicacion: projectData.ubicacion,
        descripcion: projectData.descripcion,
        observaciones: projectData.observaciones,
        costo_mano_obra: projectData.costo_mano_obra || 0,
        costo_total_materiales: projectData.costo_total_materiales || 0,
        costo_total_servicios: projectData.costo_total_servicios || 0,
        costo_total_proyecto: projectData.costo_total_proyecto || 0,
      };

      // Incluir id_responsable con valor por defecto si no está definido
      if (projectData.id_responsable !== undefined) {
        projectDataToCreate.id_responsable = projectData.id_responsable;
      } else {
        projectDataToCreate.id_responsable = null;
      }

      const project = await Project.create(projectDataToCreate, { transaction: t });

      // Crear materiales del proyecto
      if (projectData.materiales && projectData.materiales.length > 0) {
        const materiales = projectData.materiales.map((material) => {
          const qty = Number.isFinite(Number(material.cantidad)) ? Number(material.cantidad) : 0;
          const unit = Number.isFinite(Number(material.precio_unitario)) ? Number(material.precio_unitario) : 0;
          const total = Number.isFinite(Number(qty * unit)) ? Number((qty * unit).toFixed(2)) : 0;
          return {
            id_proyecto: project.id_proyecto,
            id_producto: material.id_producto,
            cantidad: qty,
            precio_unitario: unit,
            precio_total: total,
          };
        });
        await ProjectMaterial.bulkCreate(materiales, { transaction: t });
      }

      // Crear servicios del proyecto
      if (projectData.servicios && projectData.servicios.length > 0) {
        const servicios = projectData.servicios.map((servicio) => {
          const qty = Number.isFinite(Number(servicio.cantidad)) ? Number(servicio.cantidad) : 0;
          const unit = Number.isFinite(Number(servicio.precio_unitario)) ? Number(servicio.precio_unitario) : 0;
          const total = Number.isFinite(Number(qty * unit)) ? Number((qty * unit).toFixed(2)) : 0;
          return {
            id_proyecto: project.id_proyecto,
            id_servicio: servicio.id_servicio,
            cantidad: qty,
            precio_unitario: unit,
            precio_total: total,
          };
        });
        await ProjectServicio.bulkCreate(servicios, { transaction: t });
      }

      // Crear empleados asociados
      if (
        projectData.empleadosAsociados &&
        projectData.empleadosAsociados.length > 0
      ) {
        const empleados = projectData.empleadosAsociados.map((empleado) => ({
          id_proyecto: project.id_proyecto,
          id_usuario: empleado.id_usuario,
        }));
        await ProjectEmpleado.bulkCreate(empleados, { transaction: t });
      }

      // Crear sedes del proyecto
      if (projectData.sedes && projectData.sedes.length > 0) {
        for (const sedeData of projectData.sedes) {
            const sede = await ProjectSede.create(
            {
              id_proyecto: project.id_proyecto,
              nombre: sedeData.nombre,
              ubicacion: sedeData.ubicacion,
                presupuesto_materiales: Number.isFinite(Number(sedeData.presupuesto_materiales)) ? Number(sedeData.presupuesto_materiales) : 0,
                presupuesto_servicios: Number.isFinite(Number(sedeData.presupuesto_servicios)) ? Number(sedeData.presupuesto_servicios) : 0,
                presupuesto_total: Number.isFinite(Number(sedeData.presupuesto_total)) ? Number(sedeData.presupuesto_total) : 0,
                presupuesto_restante: Number.isFinite(Number(sedeData.presupuesto_restante)) ? Number(sedeData.presupuesto_restante) : 0,
            },
            { transaction: t }
          );

          // Crear materiales asignados a la sede
          if (
            sedeData.materialesAsignados &&
            sedeData.materialesAsignados.length > 0
          ) {
            const sedeMateriales = sedeData.materialesAsignados.map(
              (material) => ({
                id_proyecto_sede: sede.id_proyecto_sede,
                id_producto: material.id_producto,
                cantidad: material.cantidad,
              })
            );
            await SedeMaterial.bulkCreate(sedeMateriales, { transaction: t });
          }

          // Crear servicios asignados a la sede
          if (
            sedeData.serviciosAsignados &&
            sedeData.serviciosAsignados.length > 0
          ) {
            const sedeServicios = sedeData.serviciosAsignados.map(
              (servicio) => ({
                id_proyecto_sede: sede.id_proyecto_sede,
                id_servicio: servicio.id_servicio,
                cantidad: servicio.cantidad,
                precio_unitario: servicio.precio_unitario,
              })
            );
            await SedeServicio.bulkCreate(sedeServicios, { transaction: t });
          }
        }
      }

      // Solo hacer commit si NO se proporcionó una transacción externa
      if (!transaction) {
        await t.commit();
      }
      
      return this.getProjectById(project.id_proyecto, t);
    } catch (error) {
      // Solo hacer rollback si NO se proporcionó una transacción externa
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  async countAll() {
    return Project.count();
  }

  // Actualizar un proyecto
  async updateProject(id, projectData) {
    const transaction = await Project.sequelize.transaction();

    try {
      // Actualizar el proyecto principal
      const updateData = {
        numero_contrato: projectData.numero_contrato,
        nombre: projectData.nombre,
        id_cliente: projectData.id_cliente,
        id_cotizacion: projectData.id_cotizacion,
        fecha_inicio: projectData.fecha_inicio,
        fecha_fin: projectData.fecha_fin,
        estado: projectData.estado,
        progreso: projectData.progreso,
        prioridad: projectData.prioridad,
        ubicacion: projectData.ubicacion,
        descripcion: projectData.descripcion,
        observaciones: projectData.observaciones,
        costo_mano_obra: projectData.costo_mano_obra,
        costo_total_materiales: projectData.costo_total_materiales,
        costo_total_servicios: projectData.costo_total_servicios,
        costo_total_proyecto: projectData.costo_total_proyecto,
        fecha_actualizacion: new Date(),
      };

      // Incluir id_responsable con valor por defecto si no está definido
      if (projectData.id_responsable !== undefined) {
        updateData.id_responsable = projectData.id_responsable;
      } else {
        updateData.id_responsable = null;
      }

      await Project.update(updateData, {
        where: { id_proyecto: id },
        transaction,
      });

      // Actualizar materiales (eliminar existentes y crear nuevos)
      if (projectData.materiales) {
        await ProjectMaterial.destroy({
          where: { id_proyecto: id },
          transaction,
        });

        if (projectData.materiales.length > 0) {
          const materiales = projectData.materiales.map((material) => {
            const qty = Number.isFinite(Number(material.cantidad)) ? Number(material.cantidad) : 0;
            const unit = Number.isFinite(Number(material.precio_unitario)) ? Number(material.precio_unitario) : 0;
            const total = Number.isFinite(Number(qty * unit)) ? Number((qty * unit).toFixed(2)) : 0;
            return {
              id_proyecto: id,
              id_producto: material.id_producto,
              cantidad: qty,
              precio_unitario: unit,
              precio_total: total,
            };
          });
          await ProjectMaterial.bulkCreate(materiales, { transaction });
        }
      }

      // Actualizar servicios (eliminar existentes y crear nuevos)
      if (projectData.servicios) {
        await ProjectServicio.destroy({
          where: { id_proyecto: id },
          transaction,
        });

        if (projectData.servicios.length > 0) {
          const servicios = projectData.servicios.map((servicio) => {
            const qty = Number.isFinite(Number(servicio.cantidad)) ? Number(servicio.cantidad) : 0;
            const unit = Number.isFinite(Number(servicio.precio_unitario)) ? Number(servicio.precio_unitario) : 0;
            const total = Number.isFinite(Number(qty * unit)) ? Number((qty * unit).toFixed(2)) : 0;
            return {
              id_proyecto: id,
              id_servicio: servicio.id_servicio,
              cantidad: qty,
              precio_unitario: unit,
              precio_total: total,
            };
          });
          await ProjectServicio.bulkCreate(servicios, { transaction });
        }
      }

      // Actualizar empleados asociados
      if (projectData.empleadosAsociados) {
        await ProjectEmpleado.destroy({
          where: { id_proyecto: id },
          transaction,
        });

        if (projectData.empleadosAsociados.length > 0) {
          const empleados = projectData.empleadosAsociados.map((empleado) => ({
            id_proyecto: id,
            id_usuario: empleado.id_usuario,
          }));
          await ProjectEmpleado.bulkCreate(empleados, { transaction });
        }
      }

      // Actualizar sedes
      if (projectData.sedes) {
        // Obtener sedes existentes
        const sedesExistentes = await ProjectSede.findAll({
          where: { id_proyecto: id },
          transaction,
        });

        // Eliminar sedes existentes y sus relaciones
        for (const sede of sedesExistentes) {
          await SedeMaterial.destroy({
            where: { id_proyecto_sede: sede.id_proyecto_sede },
            transaction,
          });
          await SedeServicio.destroy({
            where: { id_proyecto_sede: sede.id_proyecto_sede },
            transaction,
          });
        }

        await ProjectSede.destroy({
          where: { id_proyecto: id },
          transaction,
        });

        // Crear nuevas sedes
        if (projectData.sedes.length > 0) {
          for (const sedeData of projectData.sedes) {
            const sede = await ProjectSede.create(
              {
                id_proyecto: id,
                nombre: sedeData.nombre,
                ubicacion: sedeData.ubicacion,
                presupuesto_materiales: Number.isFinite(Number(sedeData.presupuesto_materiales)) ? Number(sedeData.presupuesto_materiales) : 0,
                presupuesto_servicios: Number.isFinite(Number(sedeData.presupuesto_servicios)) ? Number(sedeData.presupuesto_servicios) : 0,
                presupuesto_total: Number.isFinite(Number(sedeData.presupuesto_total)) ? Number(sedeData.presupuesto_total) : 0,
                presupuesto_restante: Number.isFinite(Number(sedeData.presupuesto_restante)) ? Number(sedeData.presupuesto_restante) : 0,
              },
              { transaction }
            );

            // Crear materiales asignados a la sede
            if (
              sedeData.materialesAsignados &&
              sedeData.materialesAsignados.length > 0
            ) {
              const sedeMateriales = sedeData.materialesAsignados.map(
                (material) => ({
                  id_proyecto_sede: sede.id_proyecto_sede,
                  id_producto: material.id_producto,
                  cantidad: material.cantidad,
                })
              );
              await SedeMaterial.bulkCreate(sedeMateriales, { transaction });
            }

            // Crear servicios asignados a la sede
            if (
              sedeData.serviciosAsignados &&
              sedeData.serviciosAsignados.length > 0
            ) {
              const sedeServicios = sedeData.serviciosAsignados.map(
                (servicio) => ({
                  id_proyecto_sede: sede.id_proyecto_sede,
                  id_servicio: servicio.id_servicio,
                  cantidad: servicio.cantidad,
                  precio_unitario: servicio.precio_unitario,
                })
              );
              await SedeServicio.bulkCreate(sedeServicios, { transaction });
            }
          }
        }
      }

      await transaction.commit();
      return this.getProjectById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Eliminar un proyecto
  async deleteProject(id) {
    const transaction = await Project.sequelize.transaction();

    try {
      // Obtener sedes del proyecto
      const sedes = await ProjectSede.findAll({
        where: { id_proyecto: id },
        transaction,
      });

      // Eliminar salidas de material de todas las sedes
      for (const sede of sedes) {
        await SalidaMaterial.destroy({
          where: { id_proyecto_sede: sede.id_proyecto_sede },
          transaction,
        });
      }

      // Eliminar materiales y servicios de las sedes
      for (const sede of sedes) {
        await SedeMaterial.destroy({
          where: { id_proyecto_sede: sede.id_proyecto_sede },
          transaction,
        });
        await SedeServicio.destroy({
          where: { id_proyecto_sede: sede.id_proyecto_sede },
          transaction,
        });
      }

      // Eliminar sedes
      await ProjectSede.destroy({
        where: { id_proyecto: id },
        transaction,
      });

      // Eliminar salidas de material del proyecto
      await SalidaMaterial.destroy({
        where: { id_proyecto: id },
        transaction,
      });

      // Eliminar materiales del proyecto
      await ProjectMaterial.destroy({
        where: { id_proyecto: id },
        transaction,
      });

      // Eliminar servicios del proyecto
      await ProjectServicio.destroy({
        where: { id_proyecto: id },
        transaction,
      });

      // Eliminar empleados asociados
      await ProjectEmpleado.destroy({
        where: { id_proyecto: id },
        transaction,
      });

      // Eliminar el proyecto
      const deleted = await Project.destroy({
        where: { id_proyecto: id },
        transaction,
      });

      await transaction.commit();
      return deleted > 0;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Crear salida de material
  async createSalidaMaterial(salidaData) {
    const transaction = await Project.sequelize.transaction();

    try {
      const salida = await SalidaMaterial.create(
        {
          id_proyecto: salidaData.id_proyecto,
          id_proyecto_sede: salidaData.id_proyecto_sede,
          id_producto: salidaData.id_producto,
          cantidad: salidaData.cantidad,
          id_entregador: salidaData.id_entregador,
          receptor: salidaData.receptor,
          observaciones: salidaData.observaciones,
          costo_total: salidaData.costo_total,
          fecha_salida: salidaData.fecha_salida || new Date(),
        },
        { transaction }
      );

      // Actualizar presupuesto restante de la sede si existe
      if (salidaData.id_proyecto_sede) {
        const sede = await ProjectSede.findByPk(salidaData.id_proyecto_sede, {
          transaction,
        });
        if (sede) {
          const nuevoRestante =
            parseFloat(sede.presupuesto_restante) -
            parseFloat(salidaData.costo_total);
          await sede.update(
            {
              presupuesto_restante: Math.max(0, nuevoRestante),
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      return salida;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Obtener salidas de material de un proyecto
  async getSalidasMaterial(idProyecto, idSede = null) {
    const whereClause = { id_proyecto: idProyecto };
    if (idSede) {
      whereClause.id_proyecto_sede = idSede;
    }

    return SalidaMaterial.findAll({
      where: whereClause,
      include: [
        {
          model: require("../../models/products_category/ProductsCategory"),
          as: "producto",
          attributes: ["id_producto", "nombre"],
        },
        {
          model: require("../../models/users/Users"),
          as: "entregador",
          attributes: ["id_usuario", "nombre", "apellido"],
        },
        {
          model: ProjectSede,
          as: "sede",
          attributes: ["id_proyecto_sede", "nombre"],
        },
      ],
      order: [["fecha_salida", "DESC"]],
    });
  }

  // Obtener estadísticas de proyectos
  async getProjectStats() {
    const stats = await Project.findAll({
      attributes: [
        "estado",
        [
          Project.sequelize.fn("COUNT", Project.sequelize.col("id_proyecto")),
          "count",
        ],
      ],
      group: ["estado"],
    });

    const totalProjects = await Project.count();
    const activeProjects = await Project.count({
      where: { estado: "En Progreso" },
    });

    return {
      total: totalProjects,
      activos: activeProjects,
      porEstado: stats,
    };
  }
}

module.exports = new ProjectRepository();
