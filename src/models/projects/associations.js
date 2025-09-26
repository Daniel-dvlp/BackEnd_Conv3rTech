const Project = require("./Project");
const ProjectSede = require("./ProjectSede");
const ProjectMaterial = require("./ProjectMaterial");
const ProjectServicio = require("./ProjectServicio");
const ProjectEmpleado = require("./ProjectEmpleado");
const SalidaMaterial = require("./SalidaMaterial");
const SedeMaterial = require("./SedeMaterial");
const SedeServicio = require("./SedeServicio");

// Importar modelos relacionados
const Cliente = require("../clients/Clients");
const Usuario = require("../users/Users");
const Producto = require("../products/Product");
const Servicio = require("../services/Service");
const Quote = require("../quotes/Quote");

// Asociaciones del Proyecto principal
Project.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

Project.belongsTo(Usuario, {
  foreignKey: "id_responsable",
  as: "responsable",
});

// Un proyecto pertenece a una cotización
Project.belongsTo(Quote, {
  foreignKey: "id_cotizacion",
  as: "cotizacion",
});

// Una cotización tiene un único proyecto 
Quote.hasOne(Project, {
  foreignKey: "id_cotizacion",
  as: "proyecto",
});

// Un proyecto tiene muchas sedes
Project.hasMany(ProjectSede, {
  foreignKey: "id_proyecto",
  as: "sedes",
});

// Un proyecto tiene muchos materiales
Project.hasMany(ProjectMaterial, {
  foreignKey: "id_proyecto",
  as: "materiales",
});

// Un proyecto tiene muchos servicios
Project.hasMany(ProjectServicio, {
  foreignKey: "id_proyecto",
  as: "servicios",
});

// Un proyecto tiene muchos empleados
Project.hasMany(ProjectEmpleado, {
  foreignKey: "id_proyecto",
  as: "empleadosAsociados",
});

// Un proyecto tiene muchas salidas de material
Project.hasMany(SalidaMaterial, {
  foreignKey: "id_proyecto",
  as: "salidasMaterial",
});

// Asociaciones de las Sedes
ProjectSede.belongsTo(Project, {
  foreignKey: "id_proyecto",
  as: "proyecto",
});

// Una sede tiene muchos materiales
ProjectSede.hasMany(SedeMaterial, {
  foreignKey: "id_proyecto_sede",
  as: "materialesAsignados",
});

// Una sede tiene muchos servicios
ProjectSede.hasMany(SedeServicio, {
  foreignKey: "id_proyecto_sede",
  as: "serviciosAsignados",
});

// Una sede tiene muchas salidas de material
ProjectSede.hasMany(SalidaMaterial, {
  foreignKey: "id_proyecto_sede",
  as: "salidasMaterial",
});

// Asociaciones de Materiales del Proyecto
ProjectMaterial.belongsTo(Project, {
  foreignKey: "id_proyecto",
  as: "proyecto",
});

ProjectMaterial.belongsTo(Producto, {
  foreignKey: "id_producto",
  as: "producto",
});

// Asociaciones de Servicios del Proyecto
ProjectServicio.belongsTo(Project, {
  foreignKey: "id_proyecto",
  as: "proyecto",
});

ProjectServicio.belongsTo(Servicio, {
  foreignKey: "id_servicio",
  as: "servicio",
});

// Asociaciones de Empleados del Proyecto
ProjectEmpleado.belongsTo(Project, {
  foreignKey: "id_proyecto",
  as: "proyecto",
});

ProjectEmpleado.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "empleado",
});

// Asociaciones de Salidas de Material
SalidaMaterial.belongsTo(Project, {
  foreignKey: "id_proyecto",
  as: "proyecto",
});

SalidaMaterial.belongsTo(ProjectSede, {
  foreignKey: "id_proyecto_sede",
  as: "sede",
});

SalidaMaterial.belongsTo(Producto, {
  foreignKey: "id_producto",
  as: "producto",
});

SalidaMaterial.belongsTo(Usuario, {
  foreignKey: "id_entregador",
  as: "entregador",
});

// Asociaciones de Materiales de Sede
SedeMaterial.belongsTo(ProjectSede, {
  foreignKey: "id_proyecto_sede",
  as: "sede",
});

SedeMaterial.belongsTo(Producto, {
  foreignKey: "id_producto",
  as: "producto",
});

// Asociaciones de Servicios de Sede
SedeServicio.belongsTo(ProjectSede, {
  foreignKey: "id_proyecto_sede",
  as: "sede",
});

SedeServicio.belongsTo(Servicio, {
  foreignKey: "id_servicio",
  as: "servicio",
});

module.exports = {
  Project,
  ProjectSede,
  ProjectMaterial,
  ProjectServicio,
  ProjectEmpleado,
  SalidaMaterial,
  SedeMaterial,
  SedeServicio,
};
