const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Users = sequelize.define(
  "usuarios",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    documento: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z0-9]+$/,
      },
    },
    tipo_documento: {
      type: DataTypes.ENUM("CC", "CE", "PPT", "NIT", "PA"),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .-]+$/,
      },
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .-]+$/,
      },
    },
    celular: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: /^\+?\d{7,15}$/,
      },
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id_rol",
      },
    },
    estado_usuario: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido', 'En vacaciones', 'Retirado', 'Licencia médica'),
    allowNull: false
  },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Users;
