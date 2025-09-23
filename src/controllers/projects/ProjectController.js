const { validationResult } = require("express-validator");
const ProjectService = require("../../services/projects/ProjectService");

class ProjectController {
  // Obtener todos los proyectos
  async getAllProjects(req, res) {
    try {
      const filters = {
        search: req.query.search,
        estado: req.query.estado,
        prioridad: req.query.prioridad,
      };

      const projects = await ProjectService.getAllProjects(filters);

      res.status(200).json({
        success: true,
        data: projects,
        total: projects.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener un proyecto por ID
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  // Crear un nuevo proyecto
  async createProject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const project = await ProjectService.createProject(req.body);

      res.status(201).json({
        success: true,
        message: "Proyecto creado exitosamente",
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Actualizar un proyecto
  async updateProject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const project = await ProjectService.updateProject(id, req.body);

      res.status(200).json({
        success: true,
        message: "Proyecto actualizado exitosamente",
        data: project,
      });
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  // Eliminar un proyecto
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const result = await ProjectService.deleteProject(id);

      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  // Crear salida de material
  async createSalidaMaterial(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const result = await ProjectService.createSalidaMaterial(req.body);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener salidas de material
  async getSalidasMaterial(req, res) {
    try {
      const { idProyecto } = req.params;
      const { idSede } = req.query;

      const salidas = await ProjectService.getSalidasMaterial(
        idProyecto,
        idSede
      );

      res.status(200).json({
        success: true,
        data: salidas,
        total: salidas.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener estadísticas de proyectos
  async getProjectStats(req, res) {
    try {
      const stats = await ProjectService.getProjectStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Exportar proyectos a Excel
  async exportProjects(req, res) {
    try {
      const filters = {
        search: req.query.search,
        estado: req.query.estado,
        prioridad: req.query.prioridad,
      };

      const projects = await ProjectService.getAllProjects(filters);

      // Transformar datos para Excel
      const excelData = projects.map((project) => ({
        "Número de Contrato": project.numeroContrato,
        Nombre: project.nombre,
        Cliente: project.cliente,
        Responsable: project.responsable.nombre,
        "Fecha Inicio": project.fechaInicio,
        "Fecha Fin": project.fechaFin,
        Estado: project.estado,
        Progreso: `${project.progreso}%`,
        Prioridad: project.prioridad,
        Ubicación: project.ubicacion,
        Descripción: project.descripcion,
        Observaciones: project.observaciones,
        "Costo Mano de Obra": `$${project.costos.manoDeObra.toLocaleString()}`,
        "Total Materiales": project.materiales.length,
        "Total Servicios": project.servicios.length,
        "Total Sedes": project.sedes.length,
        "Empleados Asociados": project.empleadosAsociados.length,
      }));

      res.status(200).json({
        success: true,
        message: "Datos preparados para exportación",
        data: excelData,
        filename: `Reporte_Proyectos_${
          new Date().toISOString().split("T")[0]
        }.xlsx`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener proyectos por cliente
  async getProjectsByClient(req, res) {
    try {
      const { clientId } = req.params;
      const filters = { ...req.query, clientId };

      const projects = await ProjectService.getAllProjects(filters);

      res.status(200).json({
        success: true,
        data: projects,
        total: projects.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener proyectos por responsable
  async getProjectsByResponsible(req, res) {
    try {
      const { responsibleId } = req.params;
      const filters = { ...req.query, responsibleId };

      const projects = await ProjectService.getAllProjects(filters);

      res.status(200).json({
        success: true,
        data: projects,
        total: projects.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Actualizar progreso de un proyecto
  async updateProjectProgress(req, res) {
    try {
      const { id } = req.params;
      const { progreso } = req.body;

      if (progreso < 0 || progreso > 100) {
        return res.status(400).json({
          success: false,
          message: "El progreso debe estar entre 0 y 100",
        });
      }

      const project = await ProjectService.updateProject(id, { progreso });

      res.status(200).json({
        success: true,
        message: "Progreso actualizado exitosamente",
        data: project,
      });
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  // Cambiar estado de un proyecto
  async updateProjectStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const estadosValidos = [
        "Pendiente",
        "En Progreso",
        "Completado",
        "Cancelado",
      ];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: "Estado no válido",
        });
      }

      const project = await ProjectService.updateProject(id, { estado });

      res.status(200).json({
        success: true,
        message: "Estado actualizado exitosamente",
        data: project,
      });
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  // Marcar servicio como completado
  async markServiceAsCompleted(req, res) {
    try {
      const { idSedeServicio } = req.params;
      const result = await ProjectService.markServiceAsCompleted(
        idSedeServicio
      );

      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Servicio no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  // Marcar servicio como pendiente
  async markServiceAsPending(req, res) {
    try {
      const { idSedeServicio } = req.params;
      const result = await ProjectService.markServiceAsPending(idSedeServicio);

      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Servicio no encontrado") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  }
}

module.exports = new ProjectController();
