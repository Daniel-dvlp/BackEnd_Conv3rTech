const axios = require('axios');

// Configuración
const API_BASE_URL = process.env.API_URL || 'https://backend-conv3rtech.onrender.com/api';

console.log('🚀 CONV3RTECH - TEST COMPLETO DE PROYECTOS 🚀');
console.log('==========================================');
console.log(`API: ${API_BASE_URL}`);
console.log('');

// Cliente axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Funciones auxiliares
const log = (message, type = 'info') => {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[36m',
    reset: '\x1b[0m'
  };
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
};

// 1. Autenticación
async function authenticate() {
  log('Iniciando autenticación...', 'info');
  
  try {
    const response = await api.post('/auth/login', {
      correo: 'admin@conv3rtech.com',
      contrasena: 'admin123'
    });
    
    if (response.data.success) {
      const token = response.data.data.token;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      log('Autenticación exitosa', 'success');
      log(`Token JWT configurado: ${token.substring(0, 30)}...`, 'info');
      return true;
    } else {
      log('Error en autenticación: ' + response.data.message, 'error');
      return false;
    }
  } catch (error) {
    log('Error de conexión: ' + error.message, 'error');
    return false;
  }
}

// 2. Obtener proyectos existentes
async function getExistingProjects() {
  log('\nObteniendo proyectos existentes...', 'info');
  
  try {
    const response = await api.get('/projects');
    
    if (response.data.success) {
      const projects = response.data.data;
      log(`Se encontraron ${projects.length} proyectos`, 'success');
      
      if (projects.length > 0) {
        log('Proyectos encontrados:', 'info');
        projects.slice(0, 3).forEach((project, index) => {
          log(`  ${index + 1}. ${project.nombre} (${project.estado})`, 'info');
        });
        
        if (projects.length > 3) {
          log(`  ... y ${projects.length - 3} más`, 'info');
        }
      }
      
      return projects;
    } else {
      log('Error al obtener proyectos: ' + response.data.message, 'error');
      return [];
    }
  } catch (error) {
    log('Error al obtener proyectos: ' + error.message, 'error');
    return [];
  }
}

// 3. Obtener estadísticas
async function getProjectStats() {
  log('\nObteniendo estadísticas de proyectos...', 'info');
  
  try {
    const response = await api.get('/projects/stats');
    
    if (response.data.success) {
      const stats = response.data.data;
      log('Estadísticas obtenidas:', 'success');
      
      Object.entries(stats).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').toUpperCase();
        log(`  ${formattedKey}: ${value}`, 'info');
      });
      
      return stats;
    } else {
      log('Error al obtener estadísticas: ' + response.data.message, 'error');
      return null;
    }
  } catch (error) {
    log('Error al obtener estadísticas: ' + error.message, 'error');
    return null;
  }
}

// 4. Buscar proyecto específico
async function searchProject() {
  log('\nBuscando proyectos con término "CCTV"...', 'info');
  
  try {
    const response = await api.get('/projects/search?term=CCTV');
    
    if (response.data.success) {
      const results = response.data.data;
      log(`Búsqueda exitosa - ${results.length} resultados encontrados`, 'success');
      
      if (results.length > 0) {
        results.slice(0, 2).forEach((project, index) => {
          log(`  ${index + 1}. ${project.nombre}`, 'info');
          log(`     Cliente: ${project.cliente?.nombre || 'N/A'}`, 'info');
          log(`     Estado: ${project.estado}`, 'info');
        });
      }
      
      return results;
    } else {
      log('Error en búsqueda: ' + response.data.message, 'error');
      return [];
    }
  } catch (error) {
    log('Error en búsqueda: ' + error.message, 'error');
    return [];
  }
}

// 5. Obtener detalles de un proyecto
async function getProjectDetails(projects) {
  if (!projects || projects.length === 0) {
    log('\nNo hay proyectos para obtener detalles', 'warning');
    return;
  }
  
  const projectId = projects[0].id_proyecto;
  log(`\nObteniendo detalles del proyecto ID: ${projectId}...`, 'info');
  
  try {
    const response = await api.get(`/projects/${projectId}`);
    
    if (response.data.success) {
      const project = response.data.data;
      log('Detalles del proyecto obtenidos:', 'success');
      log(`  Nombre: ${project.nombre}`, 'info');
      log(`  Cliente: ${project.cliente?.nombre || 'N/A'}`, 'info');
      log(`  Responsable: ${project.responsable?.nombre || 'N/A'}`, 'info');
      log(`  Estado: ${project.estado}`, 'info');
      log(`  Progreso: ${project.progreso}%`, 'info');
      log(`  Prioridad: ${project.prioridad}`, 'info');
      log(`  Fecha Inicio: ${project.fecha_inicio}`, 'info');
      log(`  Fecha Fin: ${project.fecha_fin}`, 'info');
      
      if (project.materiales && project.materiales.length > 0) {
        log(`  Materiales: ${project.materiales.length} items`, 'info');
      }
      
      if (project.servicios && project.servicios.length > 0) {
        log(`  Servicios: ${project.servicios.length} items`, 'info');
      }
      
      if (project.sedes && project.sedes.length > 0) {
        log(`  Sedes: ${project.sedes.length} sedes`, 'info');
      }
      
      return project;
    } else {
      log('Error al obtener detalles: ' + response.data.message, 'error');
      return null;
    }
  } catch (error) {
    log('Error al obtener detalles: ' + error.message, 'error');
    return null;
  }
}

// 6. Obtener saldo pendiente
async function getProjectOutstanding(projects) {
  if (!projects || projects.length === 0) {
    log('\nNo hay proyectos para verificar saldo', 'warning');
    return;
  }
  
  const projectId = projects[0].id_proyecto;
  log(`\nObteniendo saldo pendiente del proyecto ID: ${projectId}...`, 'info');
  
  try {
    const response = await api.get(`/projects/${projectId}/outstanding`);
    
    if (response.data.success) {
      const outstanding = response.data.data;
      log('Saldo pendiente obtenido:', 'success');
      log(`  Total Proyecto: $${outstanding.total_proyecto?.toLocaleString() || 0}`, 'info');
      log(`  Total Pagado: $${outstanding.total_pagado?.toLocaleString() || 0}`, 'info');
      log(`  Pendiente: $${outstanding.total_pendiente?.toLocaleString() || 0}`, 'info');
      
      return outstanding;
    } else {
      log('Error al obtener saldo: ' + response.data.message, 'error');
      return null;
    }
  } catch (error) {
    log('Error al obtener saldo: ' + error.message, 'error');
    return null;
  }
}

// 7. Crear proyecto de ejemplo
async function createSampleProject() {
  log('\nCreando proyecto de ejemplo...', 'info');
  
  try {
    // Obtener cliente
    log('Obteniendo cliente...', 'info');
    const clientsResponse = await api.get('/clients');
    
    if (!clientsResponse.data.success || clientsResponse.data.data.length === 0) {
      log('No hay clientes disponibles', 'warning');
      return null;
    }
    
    const client = clientsResponse.data.data[0];
    log(`Cliente seleccionado: ${client.nombre}`, 'info');
    
    // Obtener usuario responsable
    log('Obteniendo usuario responsable...', 'info');
    const usersResponse = await api.get('/users');
    
    if (!usersResponse.data.success || usersResponse.data.data.length === 0) {
      log('No hay usuarios disponibles', 'warning');
      return null;
    }
    
    const user = usersResponse.data.data[0];
    log(`Usuario seleccionado: ${user.nombre}`, 'info');
    
    // Datos del proyecto
    const projectData = {
      numero_contrato: `CT-${Date.now()}`,
      nombre: 'Proyecto Demo - Sistema de Seguridad Integral',
      id_cliente: client.id_cliente,
      id_responsable: user.id_usuario,
      fecha_inicio: '2025-01-15',
      fecha_fin: '2025-04-15',
      estado: 'En Progreso',
      progreso: 15,
      prioridad: 'Alta',
      ubicacion: 'Medellín, Antioquia',
      descripcion: 'Instalación completa de sistema de seguridad con cámaras IP, control de acceso y alarmas',
      observaciones: 'Proyecto creado desde script de prueba',
      costo_mano_obra: 3500000
    };
    
    log('Enviando datos del proyecto...', 'info');
    const response = await api.post('/projects', projectData);
    
    if (response.data.success) {
      const created = response.data.data;
      log('Proyecto creado exitosamente!', 'success');
      log(`ID: ${created.id_proyecto}`, 'info');
      log(`Nombre: ${created.nombre}`, 'info');
      log(`Cliente: ${client.nombre}`, 'info');
      log(`Responsable: ${user.nombre}`, 'info');
      log(`Estado: ${created.estado}`, 'info');
      log(`Progreso: ${created.progreso}%`, 'info');
      
      return created.id_proyecto;
    } else {
      log('Error al crear proyecto: ' + response.data.message, 'error');
      return null;
    }
    
  } catch (error) {
    log('Error al crear proyecto: ' + error.message, 'error');
    return null;
  }
}

// 8. Actualizar proyecto
async function updateProject(projectId) {
  log(`\nActualizando proyecto ID: ${projectId}...`, 'info');
  
  try {
    const updateData = {
      progreso: 45,
      observaciones: 'Proyecto actualizado desde script de prueba - avance significativo'
    };
    
    const response = await api.put(`/projects/${projectId}`, updateData);
    
    if (response.data.success) {
      const updated = response.data.data;
      log('Proyecto actualizado exitosamente!', 'success');
      log(`Nuevo progreso: ${updated.progreso}%`, 'info');
      log(`Última actualización: ${updated.fecha_actualizacion}`, 'info');
      
      return updated;
    } else {
      log('Error al actualizar: ' + response.data.message, 'error');
      return null;
    }
    
  } catch (error) {
    log('Error al actualizar proyecto: ' + error.message, 'error');
    return null;
  }
}

// 9. Probar salida de material
async function testMaterialOutput(projectId) {
  log(`\nRegistrando salida de material para proyecto ID: ${projectId}...`, 'info');
  
  try {
    // Primero obtener el proyecto para tener una sede
    const projectResponse = await api.get(`/projects/${projectId}`);
    
    if (!projectResponse.data.success) {
      log('No se pudo obtener el proyecto', 'error');
      return;
    }
    
    const project = projectResponse.data.data;
    if (!project.sedes || project.sedes.length === 0) {
      log('El proyecto no tiene sedes asignadas', 'warning');
      return;
    }
    
    const sedeId = project.sedes[0].id_sede;
    log(`Sede seleccionada: ${project.sedes[0].nombre}`, 'info');
    
    const salidaData = {
      id_proyecto: projectId,
      id_sede: sedeId,
      material: 'Cámara IP Domo 4MP',
      cantidad: 3,
      fecha: new Date().toISOString(),
      entregador: 'Carlos Rodríguez',
      receptor: 'Juan Pérez - Supervisor',
      observaciones: 'Entrega para instalación en área de recepción',
      costo_total: 450000
    };
    
    const response = await api.post('/projects/salida-material', salidaData);
    
    if (response.data.success) {
      log('Salida de material registrada exitosamente!', 'success');
      log(`Material: ${salidaData.material}`, 'info');
      log(`Cantidad: ${salidaData.cantidad}`, 'info');
      log(`Costo total: $${salidaData.costo_total.toLocaleString()}`, 'info');
    } else {
      log('Error al registrar salida: ' + response.data.message, 'error');
    }
    
  } catch (error) {
    log('Error en salida de material: ' + error.message, 'error');
  }
}

// Función principal
async function main() {
  console.log('\n🚀 INICIANDO TEST COMPLETO DE PROYECTOS 🚀');
  console.log('========================================\n');
  
  let projects = [];
  let createdProjectId = null;
  
  try {
    // 1. Autenticación
    const authSuccess = await authenticate();
    if (!authSuccess) {
      log('No se pudo autenticar. Abortando pruebas.', 'error');
      process.exit(1);
    }
    
    // 2. Obtener proyectos existentes
    projects = await getExistingProjects();
    
    // 3. Obtener estadísticas
    await getProjectStats();
    
    // 4. Búsqueda de proyectos
    await searchProject();
    
    // 5. Obtener detalles de proyecto
    await getProjectDetails(projects);
    
    // 6. Obtener saldo pendiente
    await getProjectOutstanding(projects);
    
    // 7. Crear proyecto de ejemplo
    createdProjectId = await createSampleProject();
    
    // 8. Actualizar proyecto creado
    if (createdProjectId) {
      await updateProject(createdProjectId);
      
      // 9. Probar salida de material
      await testMaterialOutput(createdProjectId);
    }
    
    console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE 🎉');
    console.log('=====================================\n');
    
  } catch (error) {
    log('Error crítico en las pruebas: ' + error.message, 'error');
    process.exit(1);
  }
}

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Ejecutar
if (require.main === module) {
  main().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { main };