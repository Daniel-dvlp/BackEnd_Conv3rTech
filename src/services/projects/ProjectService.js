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
  async createProject(projectData, transaction = null) {
    console.error(`[DEBUG-V3] [ProjectService] createProject called with data:`, JSON.stringify(projectData, null, 2));
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

      // Validar stock de materiales
      await this.validateMaterialStock(projectData.materiales);

      const project = await ProjectRepository.createProject(projectData, transaction);
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
      throw new Error(`salida de material: ${error.message}`);
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
      // Calcular total basado en los componentes
      const calculatedTotal = totalMateriales + totalServicios + manoDeObra;
      
      // Usar el valor de la BD si existe y es mayor a 0 (prioridad a la BD), si no, usar el calculado
      const dbTotal = parseFloat(projectRaw.costo_total_proyecto ?? 0);
      const total = dbTotal > 0 ? dbTotal : calculatedTotal;

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
      cotizacion: project.cotizacion ? {
        id: project.cotizacion.id_cotizacion,
        nombre: project.cotizacion.nombre_cotizacion,
        estado: project.cotizacion.estado,
        monto: parseFloat(project.cotizacion.monto_cotizacion || 0)
      } : null,
      cliente: project.cliente?.nombre || "Cliente no encontrado",
      responsable: project.responsable ? {
        nombre: `${project.responsable.nombre || ""} ${
          project.responsable.apellido || ""
        }`.trim(),
        avatarSeed: project.responsable.nombre || "User",
      } : {
        nombre: "Sin asignar",
        avatarSeed: "User",
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
      costos: projectTotals,
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

    // El responsable es opcional en la creación, se puede asignar después
    // if (!projectData.id_responsable) {
    //   throw new Error("El responsable es obligatorio");
    // }

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
    
    // Crear fechas solo con año, mes y día para comparación
    const inicioDate = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const hoyDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    
    // Nota: Permitimos fecha de inicio en el pasado (p.ej., fecha de creación de la cotización)
    // Únicamente validamos que fecha_fin no sea anterior a fecha_inicio.

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
}

module.exports = new ProjectService();
