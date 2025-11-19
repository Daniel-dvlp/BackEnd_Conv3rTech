// generateSQL.js
// Ejecutar con: node generateSQL.js

const fs = require('fs');
const path = require('path');

// Importar la configuración de la base de datos existente
const sequelize = require('./src/config/database');

// ============= IMPORTAR MODELOS YA DEFINIDOS =============
const Role = require('./src/models/auth/Role');
const Permission = require('./src/models/auth/Permission');
const Privilege = require('./src/models/auth/Privilege');
const PermissionPrivilege = require('./src/models/auth/PermissionPrivilege');

const User = require('./src/models/users/Users');

const Client = require('./src/models/clients/Clients');
const AddressClient = require('./src/models/clients/AddressClients');

const Supplier = require('./src/models/supplier/SupplierModel');

const ProductCategory = require('./src/models/products_category/ProductsCategory');
const Product = require('./src/models/products/Product');
const Feature = require('./src/models/products/Feature');
const Datasheet = require('./src/models/products/Datasheet');

const ServiceCategory = require('./src/models/services_categories/ServiceCategory');
const Service = require('./src/models/services/Service');

const Purchase = require('./src/models/purchase/PurchaseModel');
const PurchaseDetail = require('./src/models/purchase/PurchaseDetailModel');

const Sale = require('./src/models/products_sale/Sale');
const SaleDetail = require('./src/models/products_sale/SaleDetails');

const Quote = require('./src/models/quotes/Quote');
const QuoteDetail = require('./src/models/quotes/QuoteDetails');

const Project = require('./src/models/projects/Project');
const ProjectEmpleado = require('./src/models/projects/ProjectEmpleado');
const ProjectMaterial = require('./src/models/projects/ProjectMaterial');
const ProjectSede = require('./src/models/projects/ProjectSede');
const ProjectServicio = require('./src/models/projects/ProjectServicio');
const SalidaMaterial = require('./src/models/projects/SalidaMaterial');
const SedeMaterial = require('./src/models/projects/SedeMaterial');
const SedeServicio = require('./src/models/projects/SedeServicio');

const Appointment = require('./src/models/appointments/Appointments');

const LaborScheduling = require('./src/models/labor_scheduling/LaborSchedulingModel');

const PaymentInstallment = require('./src/models/payments_installments/payments_installments');

const RolPermisoPrivilegio = require('./src/models/rol_permiso_privilegio/rol_permiso_privilegio');

const models = {
  Role,
  Permission,
  Privilege,
  PermissionPrivilege,
  User,
  Client,
  AddressClient,
  Supplier,
  ProductCategory,
  Product,
  Feature,
  Datasheet,
  ServiceCategory,
  Service,
  Purchase,
  PurchaseDetail,
  Sale,
  SaleDetail,
  Quote,
  QuoteDetail,
  Project,
  ProjectEmpleado,
  ProjectMaterial,
  ProjectSede,
  ProjectServicio,
  SalidaMaterial,
  SedeMaterial,
  SedeServicio,
  Appointment,
  LaborScheduling,
  PaymentInstallment,
  RolPermisoPrivilegio
};

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function getSqlType(fieldConfig) {
  try {
    if (fieldConfig.type && typeof fieldConfig.type.toSql === 'function') {
      return fieldConfig.type.toSql();
    }
    
    const key = fieldConfig.type?.key || fieldConfig.type?.constructor?.name || 'STRING';
    
    const typeMap = {
      'INTEGER': 'INT',
      'BIGINT': 'BIGINT',
      'STRING': 'VARCHAR(255)',
      'TEXT': 'TEXT',
      'BOOLEAN': 'TINYINT(1)',
      'DATE': 'DATETIME',
      'DATEONLY': 'DATE',
      'DECIMAL': 'DECIMAL(10,2)',
      'FLOAT': 'FLOAT',
      'DOUBLE': 'DOUBLE',
      'UUID': 'VARCHAR(36)',
      'ENUM': 'VARCHAR(255)',
      'JSON': 'JSON'
    };
    
    return typeMap[key] || 'VARCHAR(255)';
  } catch (error) {
    return 'VARCHAR(255)';
  }
}

function getDbDiagramType(sqlType) {
  const type = sqlType.toLowerCase();
  if (type.includes('varchar') || type.includes('char')) return 'varchar';
  if (type.includes('int')) return 'int';
  if (type.includes('text')) return 'text';
  if (type.includes('datetime')) return 'datetime';
  if (type.includes('date')) return 'date';
  if (type.includes('tinyint(1)') || type.includes('boolean')) return 'boolean';
  if (type.includes('decimal')) return 'decimal';
  if (type.includes('float') || type.includes('double')) return 'float';
  if (type.includes('json')) return 'json';
  return 'varchar';
}

// ========================================
// GENERACIÓN DE SCRIPTS
// ========================================

async function generateScripts() {
  try {
    console.log('🔄 Generando scripts...\n');
    
    let sqlScript = `-- Script SQL generado automáticamente
-- Fecha: ${new Date().toLocaleString()}
-- Base de datos: MySQL/MariaDB

SET FOREIGN_KEY_CHECKS = 0;

`;

    let dbDiagram = `// Usar en: https://dbdiagram.io
// Generado: ${new Date().toLocaleString()}

`;

    // Generar CREATE TABLE para cada modelo
    for (const [modelName, model] of Object.entries(models)) {
      try {
        const tableName = model.tableName || model.name || modelName.toLowerCase();
        const attributes = model.rawAttributes || model.tableAttributes || {};
        
        console.log(`✓ Procesando: ${tableName}`);
        
        // ===== SQL =====
        sqlScript += `-- Tabla: ${tableName}\n`;
        sqlScript += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
        sqlScript += `CREATE TABLE \`${tableName}\` (\n`;
        
        const columns = [];
        const foreignKeys = [];
        
        for (const [fieldName, fieldConfig] of Object.entries(attributes)) {
          let columnDef = `  \`${fieldName}\` `;
          
          // Tipo de dato
          const sqlType = getSqlType(fieldConfig);
          columnDef += sqlType;
          
          // Primary Key
          if (fieldConfig.primaryKey) {
            columnDef += ' PRIMARY KEY';
          }
          
          // Auto Increment
          if (fieldConfig.autoIncrement) {
            columnDef += ' AUTO_INCREMENT';
          }
          
          // NULL / NOT NULL
          if (fieldConfig.allowNull === false && !fieldConfig.primaryKey) {
            columnDef += ' NOT NULL';
          }
          
          // Unique
          if (fieldConfig.unique) {
            columnDef += ' UNIQUE';
          }
          
          // Default Value
          if (fieldConfig.defaultValue !== undefined && 
              fieldConfig.defaultValue !== null &&
              typeof fieldConfig.defaultValue !== 'object' &&
              typeof fieldConfig.defaultValue !== 'function') {
            let defaultVal = fieldConfig.defaultValue;
            if (typeof defaultVal === 'string') {
              defaultVal = `'${defaultVal}'`;
            } else if (typeof defaultVal === 'boolean') {
              defaultVal = defaultVal ? '1' : '0';
            }
            columnDef += ` DEFAULT ${defaultVal}`;
          }
          
          // Detectar Foreign Keys
          if (fieldConfig.references) {
            foreignKeys.push({
              field: fieldName,
              references: fieldConfig.references
            });
          }
          
          columns.push(columnDef);
        }
        
        sqlScript += columns.join(',\n');
        
        // Agregar Foreign Keys
        if (foreignKeys.length > 0) {
          sqlScript += ',\n';
          const fkConstraints = foreignKeys.map((fk, idx) => {
            const refTable = fk.references.model || fk.references.table || 'unknown';
            const refKey = fk.references.key || 'id';
            return `  CONSTRAINT \`fk_${tableName}_${fk.field}\` FOREIGN KEY (\`${fk.field}\`) REFERENCES \`${refTable}\`(\`${refKey}\`)`;
          });
          sqlScript += fkConstraints.join(',\n');
        }
        
        sqlScript += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n';
        
        // ===== DBDIAGRAM =====
        dbDiagram += `Table ${tableName} {\n`;
        
        for (const [fieldName, fieldConfig] of Object.entries(attributes)) {
          const sqlType = getSqlType(fieldConfig);
          const dbType = getDbDiagramType(sqlType);
          
          let line = `  ${fieldName} ${dbType}`;
          
          // Constraints
          const constraints = [];
          if (fieldConfig.primaryKey) constraints.push('pk');
          if (fieldConfig.autoIncrement) constraints.push('increment');
          if (fieldConfig.unique) constraints.push('unique');
          if (fieldConfig.allowNull === false) constraints.push('not null');
          
          if (constraints.length > 0) {
            line += ` [${constraints.join(', ')}]`;
          }
          
          dbDiagram += line + '\n';
        }
        
        dbDiagram += '}\n\n';
        
      } catch (modelError) {
        console.log(`⚠️  Error procesando ${modelName}: ${modelError.message}`);
      }
    }
    
    sqlScript += 'SET FOREIGN_KEY_CHECKS = 1;\n';
    
    // Relaciones para dbdiagram
    dbDiagram += '// Relaciones\n';
    for (const [modelName, model] of Object.entries(models)) {
      try {
        const tableName = model.tableName || model.name || modelName.toLowerCase();
        const attributes = model.rawAttributes || model.tableAttributes || {};
        
        for (const [fieldName, fieldConfig] of Object.entries(attributes)) {
          if (fieldConfig.references) {
            const refTable = fieldConfig.references.model || fieldConfig.references.table || 'unknown';
            const refKey = fieldConfig.references.key || 'id';
            dbDiagram += `Ref: ${tableName}.${fieldName} > ${refTable}.${refKey}\n`;
          }
        }
      } catch (error) {
        // Ignorar errores en relaciones
      }
    }
    
    // Guardar archivos
    fs.writeFileSync('database_schema.sql', sqlScript);
    fs.writeFileSync('dbdiagram_schema.txt', dbDiagram);
    
    console.log('\n✅ Scripts generados exitosamente!\n');
    console.log('📄 database_schema.sql - Script para MySQL Workbench');
    console.log('📄 dbdiagram_schema.txt - Script para https://dbdiagram.io\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Ejecutar
generateScripts();