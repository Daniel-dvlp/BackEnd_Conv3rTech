const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// Tabla: rol_privilegio
// - Relaciona roles con privilegios directamente
// - Índice único en (id_rol, id_privilegio)
const RolePrivilege = sequelize.define(
  "rol_privilegio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "rol_privilegio",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["id_rol", "id_privilegio"],
        name: "uk_rol_privilegio",
      },
    ],
  }
);

module.exports = RolePrivilege;