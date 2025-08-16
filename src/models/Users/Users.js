const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

//const Rol = require('./rol.model');

const Users = sequelize.define('Users', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  documento: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  tipo_documento: {
    type: DataTypes.ENUM('CC', 'CE', 'PPT', 'NIT', 'PA'),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  celular: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_rol: {
    //type: DataTypes.INTEGER,
    //mientras se hace la tabla de roles
    type: DataTypes.STRING(50),
    allowNull: false
  },
  id_estado_usuario: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido', 'En vacaciones', 'Retirado', 'Licencia médica'),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

// Asociaciones
// Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });
// Rol.hasMany(Users, { foreignKey: 'id_rol' });


module.exports = Users;
