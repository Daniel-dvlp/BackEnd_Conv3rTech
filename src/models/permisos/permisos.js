const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Permisos = sequelize.define(
  "permisos",
  {
    id_permiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_permiso: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z_]+$/,
      },
    },
  },
  {
    tableName: "permisos",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Permisos;
