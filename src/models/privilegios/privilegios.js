const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Privilegios = sequelize.define(
  "privilegios",
  {
    id_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_privilegio: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z ]+$/,
      },
    },
  },
  {
    tableName: "privilegios",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Privilegios;
