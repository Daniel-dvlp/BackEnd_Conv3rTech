const ProjectRepository = require("../../repositories/projects/ProjectRepository");

class ProjectService {
  // Obtener todos los proyectos
  async getAllProjects(filters = {}) {
    try {
      const projects = await ProjectRepository.getAllProjects(filters);

      // Transformar datos para que coincidan con el frontend
      return projects.map((project) => this.transformProjectData(project));
    } catch (error) {
      throw new Error(`Error al obtener proyectos: ${error.message}`);
    }
  }

  // Búsqueda rápida por número de contrato, nombre de proyecto o nombre de cliente
  async quickSearch(term, options = {}) {
    try {
      const limit = Number(options.limit || 10);
      const rawResults = await ProjectRepository.quickSearch(term, { limit });
      return rawResults.map((p) => ({
        id: p.id_proyecto,
        numeroContrato: p.numero_contrato,
        nombre: p.nombre,
        cliente: p.cliente?.nombre,
      }));
    } catch (error) {
      throw new Error(`Error en búsqueda de proyectos: ${error.message}`);
    }
  }

  // Obtener un proyecto por ID
  async getProjectById(id) {
    try {
      const project = await ProjectRepository.getProjectById(id);
      if (!project) {
        throw new Error("Proyecto no encontrado");
      }

      return this.transformProjectData(project);
    } catch (error) {
      throw new Error(`Error al obtener proyecto: ${error.message}`);
    }
  }

  // Saldo pendiente del proyecto integrando reglas de pagos
  async getOutstandingByProjectId(projectId) {
    try {
      const { calculateOutstanding } = require("../payments_installments/payments_installmentsServices");
      const { proyecto, totalProyecto, totalPagado, pendiente } = await calculateOutstanding(projectId);
      return {
        id: proyecto.id_proyecto,
        numeroContrato: proyecto.numero_contrato,
        nombre: proyecto.nombre,
        cliente: proyecto.cliente?.nombre,
        totalProyecto: parseFloat(totalProyecto),
        totalPagado: parseFloat(totalPagado),
        pendiente: parseFloat(pendiente),
        credito: !!proyecto?.cliente?.credito,
      };
    } catch (error) {
      throw new Error(error.statusCode === 404 ? "Proyecto no encontrado" : `Error al obtener saldo pendiente: ${error.message}`);
    }
  }

  // Crear un nuevo proyecto
  async createProject(projectData) {
    try {
      // Validar datos requeridos
      this.validateProjectData(projectData);

      // Generar número de contrato si no se proporciona
      if (!projectData.numero_contrato) {
        projectData.numero_contrato = await this.generateContractNumber();
      }

      // Validar fechas
      this.validateProjectDates(
        projectData.fecha_inicio,
        projectData.fecha_fin
      );

      // Obtener precios automáticamente para materiales
      if (projectData.materiales && projectData.materiales.length > 0) {
        projectData.materiales = await this.enrichMaterialData(
          projectData.materiales
        );
      }

      // Obtener precios automáticamente para servicios
      if (projectData.servicios && projectData.servicios.length > 0) {
        projectData.servicios = await this.enrichServiceData(
          projectData.servicios
        );
      }

      // Crear sedes basadas en direcciones del cliente
      if (projectData.sedes && projectData.sedes.length > 0) {
        projectData.sedes = await this.enrichSedeData(
          projectData.sedes,
          projectData.id_cliente
        );
      }

      // Calcular costos totales del proyecto
      const costosCalculados = this.calculateProjectCosts(projectData);
      projectData.costo_total_materiales = costosCalculados.totalMateriales;
      projectData.costo_total_servicios = costosCalculados.totalServicios;
      projectData.costo_total_proyecto = costosCalculados.totalProyecto;

      // Validar stock de materiales
      await this.validateMaterialStock(projectData.materiales);

      const project = await ProjectRepository.createProject(projectData);
      return this.transformProjectData(project);
    } catch (error) {
      throw new Error(`Error al crear proyecto: ${error.message}`);
    }
  }

  // Actualizar un proyecto
  async updateProject(id, projectData) {
    try {
      // Verificar que el proyecto existe
      const existingProject = await ProjectRepository.getProjectById(id);
      if (!existingProject) {
        throw new Error("Proyecto no encontrado");
      }

      // Validar datos requeridos
      this.validateProjectData(projectData);

      // Validar fechas
      this.validateProjectDates(
        projectData.fecha_inicio,
        projectData.fecha_fin
      );

      // Obtener precios automáticamente para materiales
      if (projectData.materiales && projectData.materiales.length > 0) {
        projectData.materiales = await this.enrichMaterialData(
          projectData.materiales
        );
      }

      // Obtener precios automáticamente para servicios
      if (projectData.servicios && projectData.servicios.length > 0) {
        projectData.servicios = await this.enrichServiceData(
          projectData.servicios
        );
      }

      // Crear sedes basadas en direcciones del cliente
      if (projectData.sedes && projectData.sedes.length > 0) {
        projectData.sedes = await this.enrichSedeData(
          projectData.sedes,
          projectData.id_cliente
        );
      }

      // Calcular costos totales del proyecto
      const costosCalculados = this.calculateProjectCosts(projectData);
      projectData.costo_total_materiales = costosCalculados.totalMateriales;
      projectData.costo_total_servicios = costosCalculados.totalServicios;
      projectData.costo_total_proyecto = costosCalculados.totalProyecto;

      // Validar stock de materiales
      await this.validateMaterialStock(projectData.materiales, id);

      const project = await ProjectRepository.updateProject(id, projectData);
      return this.transformProjectData(project);
    } catch (error) {
      throw new Error(`Error al actualizar proyecto: ${error.message}`);
    }
  }

  // Eliminar un proyecto
  async deleteProject(id) {
    try {
      const deleted = await ProjectRepository.deleteProject(id);
      if (!deleted) {
        throw new Error("Proyecto no encontrado");
      }
      return { success: true, message: "Proyecto eliminado exitosamente" };
    } catch (error) {
      throw new Error(`Error al eliminar proyecto: ${error.message}`);
    }
  }

  // Crear salida de material
  async createSalidaMaterial(salidaData) {
    try {
      // Validar datos de salida
      this.validateSalidaData(salidaData);

      // Verificar que el proyecto existe
      const project = await ProjectRepository.getProjectById(
        salidaData.id_proyecto
      );
      if (!project) {
        throw new Error("Proyecto no encontrado");
      }

      // Verificar que la sede existe si se especifica
      if (salidaData.id_proyecto_sede) {
        const sede = project.sedes.find(
          (s) => s.id_proyecto_sede === salidaData.id_proyecto_sede
        );
        if (!sede) {
          throw new Error("Sede no encontrada");
        }
      }

      const salida = await ProjectRepository.createSalidaMaterial(salidaData);
      return {
        success: true,
        message: "Salida de material registrada exitosamente",
        salida: salida,
      };
    } catch (error) {
      throw new Error(`Error al crear salida de material: ${error.message}`);
    }
  }

  // Obtener salidas de material
  async getSalidasMaterial(idProyecto, idSede = null) {
    try {
      const salidas = await ProjectRepository.getSalidasMaterial(
        idProyecto,
        idSede
      );
      return salidas.map((salida) => ({
        id: salida.id_salida_material,
        material: salida.producto?.nombre || "Material no encontrado",
        cantidad: salida.cantidad,
        entregador: `${salida.entregador?.nombre || ""} ${
          salida.entregador?.apellido || ""
        }`.trim(),
        receptor: salida.receptor,
        observaciones: salida.observaciones,
        costoTotal: parseFloat(salida.costo_total),
        fecha: salida.fecha_salida,
        sede: salida.sede?.nombre || "Sin sede específica",
      }));
    } catch (error) {
      throw new Error(`Error al obtener salidas de material: ${error.message}`);
    }
  }

  // Obtener estadísticas de proyectos
  async getProjectStats() {
    try {
      return await ProjectRepository.getProjectStats();
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  // Marcar servicio como completado
  async markServiceAsCompleted(idSedeServicio) {
    try {
      const SedeServicio = require("../../models/projects/SedeServicio");

      const servicio = await SedeServicio.findByPk(idSedeServicio);
      if (!servicio) {
        throw new Error("Servicio no encontrado");
      }

      await servicio.update({
        estado: "completado",
        fecha_completado: new Date(),
      });

      return {
        success: true,
        message: "Servicio marcado como completado exitosamente",
      };
    } catch (error) {
      throw new Error(
        `Error al marcar servicio como completado: ${error.message}`
      );
    }
  }

  // Marcar servicio como pendiente
  async markServiceAsPending(idSedeServicio) {
    try {
      const SedeServicio = require("../../models/projects/SedeServicio");

      const servicio = await SedeServicio.findByPk(idSedeServicio);
      if (!servicio) {
        throw new Error("Servicio no encontrado");
      }

      await servicio.update({
        estado: "pendiente",
        fecha_completado: null,
      });

      return {
        success: true,
        message: "Servicio marcado como pendiente exitosamente",
      };
    } catch (error) {
      throw new Error(
        `Error al marcar servicio como pendiente: ${error.message}`
      );
    }
  }

  // Métodos auxiliares privados

  // Transformar datos del proyecto para el frontend
  transformProjectData(project) {
    // Calcular totales a nivel de sede usando el objeto crudo de sequelize
    const calculateSedeTotals = (sedeRaw) => {
      const totalMateriales = (sedeRaw.materialesAsignados || []).reduce(
        (acc, mat) => {
          const unit = parseFloat(mat.producto?.precio ?? 0);
          const qty = parseFloat(mat.cantidad ?? 0);
          return acc + unit * qty;
        },
        0
      );

      const totalServicios = (sedeRaw.serviciosAsignados || []).reduce(
        (acc, serv) => {
          const unit = parseFloat(
            serv.precio_unitario ?? serv.servicio?.precio ?? 0
          );
          const qty = parseFloat(serv.cantidad ?? 0);
          return acc + unit * qty;
        },
        0
      );

      const ejecutadoPorSalidas = (sedeRaw.salidasMaterial || []).reduce(
        (acc, s) => {
          return acc + parseFloat(s.costo_total ?? 0);
        },
        0
      );

      const presupuestoTotal = parseFloat(sedeRaw.presupuesto_total ?? 0);
      const restante = presupuestoTotal
        ? Math.max(0, presupuestoTotal - ejecutadoPorSalidas)
        : undefined;

      return {
        materiales: parseFloat(totalMateriales.toFixed(2)),
        servicios: parseFloat(totalServicios.toFixed(2)),
        total: parseFloat((totalMateriales + totalServicios).toFixed(2)),
        ejecutadoPorSalidas: parseFloat(ejecutadoPorSalidas.toFixed(2)),
        restante:
          restante !== undefined ? parseFloat(restante.toFixed(2)) : undefined,
      };
    };

    // Calcular totales a nivel de proyecto usando el objeto crudo de sequelize
    const calculateProjectTotals = (projectRaw) => {
      const totalMateriales = (projectRaw.materiales || []).reduce((acc, m) => {
        const unit = parseFloat(m.precio_unitario ?? 0);
        const qty = parseFloat(m.cantidad ?? 0);
        return acc + unit * qty;
      }, 0);

      const totalServicios = (projectRaw.servicios || []).reduce((acc, s) => {
        const unit = parseFloat(s.precio_unitario ?? 0);
        const qty = parseFloat(s.cantidad ?? 0);
        return acc + unit * qty;
      }, 0);

      const manoDeObra = parseFloat(projectRaw.costo_mano_obra ?? 0);
      const total = totalMateriales + totalServicios + manoDeObra;

      return {
        materiales: parseFloat(totalMateriales.toFixed(2)),
        servicios: parseFloat(totalServicios.toFixed(2)),
        manoDeObra: parseFloat(manoDeObra.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      };
    };

    const projectTotals = calculateProjectTotals(project);

    return {
      id: project.id_proyecto,
      numeroContrato: project.numero_contrato,
      nombre: project.nombre,
      cliente: project.cliente?.nombre || "Cliente no encontrado",
      responsable: {
        nombre: `${project.responsable?.nombre || ""} ${
          project.responsable?.apellido || ""
        }`.trim(),
        avatarSeed: project.responsable?.nombre || "User",
      },
      fechaInicio: project.fecha_inicio,
      fechaFin: project.fecha_fin,
      estado: project.estado,
      progreso: project.progreso,
      prioridad: project.prioridad,
      ubicacion: project.ubicacion,
      empleadosAsociados:
        project.empleadosAsociados?.map((emp) => ({
          nombre: `${emp.empleado?.nombre || ""} ${
            emp.empleado?.apellido || ""
          }`.trim(),
          avatarSeed: emp.empleado?.nombre || "User",
        })) || [],
      descripcion: project.descripcion,
      materiales:
        project.materiales?.map((mat) => ({
          item: mat.producto?.nombre || "Material no encontrado",
          cantidad: mat.cantidad,
          precio: parseFloat(mat.precio_unitario),
        })) || [],
      servicios:
        project.servicios?.map((serv) => ({
          servicio: serv.servicio?.nombre || "Servicio no encontrado",
          cantidad: serv.cantidad,
          precio: parseFloat(serv.precio_unitario),
        })) || [],
      costos: {
        ...projectTotals,
        totalMaterialesCalculado: parseFloat(
          project.costo_total_materiales || 0
        ),
        totalServiciosCalculado: parseFloat(project.costo_total_servicios || 0),
        totalProyectoCalculado: parseFloat(project.costo_total_proyecto || 0),
        costoManoDeObraCalculado: parseFloat(project.costo_mano_obra || 0),
      },
      observaciones: project.observaciones,
      sedes:
        project.sedes?.map((sede) => ({
          nombre: sede.nombre,
          ubicacion: sede.ubicacion,
          materialesAsignados:
            sede.materialesAsignados?.map((mat) => ({
              item: mat.producto?.nombre || "Material no encontrado",
              cantidad: mat.cantidad,
            })) || [],
          serviciosAsignados:
            sede.serviciosAsignados?.map((serv) => ({
              id: serv.id_sede_servicio,
              servicio: serv.servicio?.nombre || "Servicio no encontrado",
              cantidad: serv.cantidad,
              precio: parseFloat(serv.precio_unitario),
              estado: serv.estado || "pendiente",
              fechaCompletado: serv.fecha_completado,
              categoria: serv.servicio?.categoria
                ? {
                    id: serv.servicio.categoria.id,
                    nombre: serv.servicio.categoria.nombre,
                    descripcion: serv.servicio.categoria.descripcion,
                  }
                : null,
            })) || [],
          presupuesto: {
            materiales: parseFloat(sede.presupuesto_materiales),
            servicios: parseFloat(sede.presupuesto_servicios),
            total: parseFloat(sede.presupuesto_total),
            restante: parseFloat(sede.presupuesto_restante),
          },
          totales: calculateSedeTotals(sede),
          salidasMaterial:
            sede.salidasMaterial?.map((salida) => ({
              id: salida.id_salida_material,
              fecha: salida.fecha_salida,
              material: salida.producto?.nombre || "Material no encontrado",
              cantidad: salida.cantidad,
              entregador: `${salida.entregador?.nombre || ""} ${
                salida.entregador?.apellido || ""
              }`.trim(),
              receptor: salida.receptor,
              observaciones: salida.observaciones,
              costoTotal: parseFloat(salida.costo_total),
            })) || [],
        })) || [],
    };
  }

  // Validar datos del proyecto
  validateProjectData(projectData) {
    if (!projectData.nombre || !projectData.nombre.trim()) {
      throw new Error("El nombre del proyecto es obligatorio");
    }

    if (!projectData.id_cliente) {
      throw new Error("El cliente es obligatorio");
    }

    if (!projectData.id_responsable) {
      throw new Error("El responsable es obligatorio");
    }

    if (!projectData.fecha_inicio) {
      throw new Error("La fecha de inicio es obligatoria");
    }

    if (!projectData.fecha_fin) {
      throw new Error("La fecha de fin es obligatoria");
    }

    if (!projectData.estado) {
      throw new Error("El estado es obligatorio");
    }

    if (!projectData.prioridad) {
      throw new Error("La prioridad es obligatoria");
    }
  }

  // Validar fechas del proyecto
  validateProjectDates(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (inicio < hoy) {
      throw new Error("La fecha de inicio no puede ser anterior al día actual");
    }

    if (fin < inicio) {
      throw new Error(
        "La fecha de fin no puede ser anterior a la fecha de inicio"
      );
    }
  }

  // Validar stock de materiales
  async validateMaterialStock(materiales, projectId = null) {
    if (!materiales || materiales.length === 0) {
      return;
    }

    const ProductRepository = require("../../repositories/products/ProductRepository");

    for (const material of materiales) {
      const producto = await ProductRepository.getProductById(
        material.id_producto
      );
      if (!producto) {
        throw new Error(
          `Producto con ID ${material.id_producto} no encontrado`
        );
      }

      // Calcular stock disponible (excluyendo el proyecto actual si se está actualizando)
      let stockDisponible = producto.stock;

      if (projectId) {
        // Obtener cantidad asignada en otros proyectos
        const proyectosConMaterial = await ProjectRepository.getAllProjects();
        for (const proyecto of proyectosConMaterial) {
          if (proyecto.id_proyecto !== projectId) {
            const materialEnProyecto = proyecto.materiales?.find(
              (m) => m.id_producto === material.id_producto
            );
            if (materialEnProyecto) {
              stockDisponible -= materialEnProyecto.cantidad;
            }
          }
        }
      }

      if (material.cantidad > stockDisponible) {
        throw new Error(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${stockDisponible}, Solicitado: ${material.cantidad}`
        );
      }
    }
  }

  // Validar datos de salida
  validateSalidaData(salidaData) {
    if (!salidaData.id_proyecto) {
      throw new Error("El ID del proyecto es obligatorio");
    }

    if (!salidaData.id_producto) {
      throw new Error("El ID del producto es obligatorio");
    }

    if (!salidaData.cantidad || salidaData.cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    if (!salidaData.id_entregador) {
      throw new Error("El entregador es obligatorio");
    }

    if (!salidaData.receptor || !salidaData.receptor.trim()) {
      throw new Error("El receptor es obligatorio");
    }
  }

  // Generar número de contrato
  async generateContractNumber() {
    const projects = await ProjectRepository.getAllProjects();
    const currentYear = new Date().getFullYear();
    const projectCount = projects.length + 1;
    return `CT-${currentYear}-${projectCount.toString().padStart(3, "0")}`;
  }

  // Enriquecer datos de materiales con información del producto
  async enrichMaterialData(materiales) {
    const Product = require("../../models/products/Product");

    const enrichedMateriales = [];

    for (const material of materiales) {
      const producto = await Product.findByPk(material.id_producto);

      if (!producto) {
        throw new Error(
          `Producto con ID ${material.id_producto} no encontrado`
        );
      }

      enrichedMateriales.push({
        id_producto: material.id_producto,
        cantidad: material.cantidad,
        precio_unitario: parseFloat(producto.precio), // Usar el precio del producto
        precio_total: material.cantidad * parseFloat(producto.precio),
      });
    }

    return enrichedMateriales;
  }

  // Enriquecer datos de servicios con información del servicio
  async enrichServiceData(servicios) {
    const Service = require("../../models/services/Service");

    const enrichedServicios = [];

    for (const servicio of servicios) {
      const servicioData = await Service.findByPk(servicio.id_servicio);

      if (!servicioData) {
        throw new Error(
          `Servicio con ID ${servicio.id_servicio} no encontrado`
        );
      }

      enrichedServicios.push({
        id_servicio: servicio.id_servicio,
        cantidad: servicio.cantidad,
        precio_unitario: parseFloat(servicioData.precio), // Usar el precio del servicio
        precio_total: servicio.cantidad * parseFloat(servicioData.precio),
      });
    }

    return enrichedServicios;
  }

  // Enriquecer datos de sedes basadas en direcciones del cliente
  async enrichSedeData(sedes, idCliente) {
    const AddressClients = require("../../models/clients/AddressClients");

    const enrichedSedes = [];

    for (const sede of sedes) {
      // Si se proporciona id_direccion, obtener datos de la dirección
      if (sede.id_direccion) {
        const direccion = await AddressClients.findByPk(sede.id_direccion);

        if (!direccion) {
          throw new Error(
            `Dirección con ID ${sede.id_direccion} no encontrada`
          );
        }

        // Verificar que la dirección pertenece al cliente
        if (direccion.id_cliente !== idCliente) {
          throw new Error(
            `La dirección ${sede.id_direccion} no pertenece al cliente ${idCliente}`
          );
        }

        enrichedSedes.push({
          nombre: sede.nombre || direccion.nombre_direccion,
          ubicacion:
            sede.ubicacion || `${direccion.direccion}, ${direccion.ciudad}`,
          presupuesto_materiales: sede.presupuesto_materiales || 0,
          presupuesto_servicios: sede.presupuesto_servicios || 0,
          presupuesto_total: sede.presupuesto_total || 0,
          presupuesto_restante: sede.presupuesto_restante || 0,
          materialesAsignados: sede.materialesAsignados || [],
          serviciosAsignados: sede.serviciosAsignados || [],
        });
      } else {
        // Si no se proporciona id_direccion, usar datos manuales
        enrichedSedes.push({
          nombre: sede.nombre,
          ubicacion: sede.ubicacion,
          presupuesto_materiales: sede.presupuesto_materiales || 0,
          presupuesto_servicios: sede.presupuesto_servicios || 0,
          presupuesto_total: sede.presupuesto_total || 0,
          presupuesto_restante: sede.presupuesto_restante || 0,
          materialesAsignados: sede.materialesAsignados || [],
          serviciosAsignados: sede.serviciosAsignados || [],
        });
      }
    }

    return enrichedSedes;
  }

  // Calcular costos totales del proyecto
  calculateProjectCosts(projectData) {
    let totalMateriales = 0;
    let totalServicios = 0;
    let totalSedesMateriales = 0;
    let totalSedesServicios = 0;

    // Calcular totales de materiales del proyecto
    if (projectData.materiales && projectData.materiales.length > 0) {
      totalMateriales = projectData.materiales.reduce((acc, material) => {
        return (
          acc +
          parseFloat(material.precio_unitario) * parseFloat(material.cantidad)
        );
      }, 0);
    }

    // Calcular totales de servicios del proyecto
    if (projectData.servicios && projectData.servicios.length > 0) {
      totalServicios = projectData.servicios.reduce((acc, servicio) => {
        return (
          acc +
          parseFloat(servicio.precio_unitario) * parseFloat(servicio.cantidad)
        );
      }, 0);
    }

    // Calcular totales de materiales en sedes
    if (projectData.sedes && projectData.sedes.length > 0) {
      projectData.sedes.forEach((sede) => {
        if (sede.materialesAsignados && sede.materialesAsignados.length > 0) {
          // Obtener precios de productos para materiales de sede
          sede.materialesAsignados.forEach((material) => {
            // Buscar el producto en los materiales del proyecto para obtener su precio
            const productoEnProyecto = projectData.materiales?.find(
              (p) => p.id_producto === material.id_producto
            );
            if (productoEnProyecto) {
              totalSedesMateriales +=
                parseFloat(productoEnProyecto.precio_unitario) *
                parseFloat(material.cantidad);
            }
          });
        }

        if (sede.serviciosAsignados && sede.serviciosAsignados.length > 0) {
          sede.serviciosAsignados.forEach((servicio) => {
            // Buscar el servicio en los servicios del proyecto para obtener su precio
            const servicioEnProyecto = projectData.servicios?.find(
              (s) => s.id_servicio === servicio.id_servicio
            );
            if (servicioEnProyecto) {
              totalSedesServicios +=
                parseFloat(servicioEnProyecto.precio_unitario) *
                parseFloat(servicio.cantidad);
            }
          });
        }
      });
    }

    // Sumar costos de mano de obra
    const costoManoDeObra = parseFloat(projectData.costo_mano_obra || 0);

    // Calcular totales
    const totalMaterialesFinal = totalMateriales + totalSedesMateriales;
    const totalServiciosFinal = totalServicios + totalSedesServicios;
    const totalProyecto =
      totalMaterialesFinal + totalServiciosFinal + costoManoDeObra;

    return {
      totalMateriales: parseFloat(totalMaterialesFinal.toFixed(2)),
      totalServicios: parseFloat(totalServiciosFinal.toFixed(2)),
      totalProyecto: parseFloat(totalProyecto.toFixed(2)),
      costoManoDeObra: parseFloat(costoManoDeObra.toFixed(2)),
      materialesProyecto: parseFloat(totalMateriales.toFixed(2)),
      serviciosProyecto: parseFloat(totalServicios.toFixed(2)),
      materialesSedes: parseFloat(totalSedesMateriales.toFixed(2)),
      serviciosSedes: parseFloat(totalSedesServicios.toFixed(2)),
    };
  }
}

module.exports = new ProjectService();
