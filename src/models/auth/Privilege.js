const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Privilege = sequelize.define(
  "Privilege",
  {
    id_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_privilegio: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "privilegios",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Privilege;
