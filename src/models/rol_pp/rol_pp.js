const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RolPP = sequelize.define(
  "rol_pp",
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "roles",
        key: "id_rol",
      },
    },
    id_pp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "permiso_privilegio",
        key: "id_pp",
      },
    },
  },
  {
    tableName: "rol_pp",
    timestamps: false,
    underscored: true,
  }
);

module.exports = RolPP;
