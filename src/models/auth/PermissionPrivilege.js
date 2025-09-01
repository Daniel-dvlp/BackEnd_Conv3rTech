const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PermissionPrivilege = sequelize.define(
  "PermissionPrivilege",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_permiso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "permisos",
        key: "id_permiso",
      },
    },
    id_privilegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "privilegios",
        key: "id_privilegio",
      },
    },
  },
  {
    tableName: "permiso_privilegio",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["id_permiso", "id_privilegio"],
        name: "unique_permiso_privilegio",
      },
    ],
  }
);

module.exports = PermissionPrivilege;
