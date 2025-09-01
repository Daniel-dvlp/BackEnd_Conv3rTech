const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Roles = sequelize.define(
  "roles",
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_rol: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z ]+$/,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Roles;
