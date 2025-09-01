const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const AddressClients = require("./AddressClients");

const Clients = sequelize.define(
  "Clients",
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documento: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    tipo_documento: {
      type: DataTypes.ENUM("CC", "CE", "PPT", "NIT", "PA"),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    credito: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    estado_cliente: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "clientes",
    timestamps: false,
    underscored: true,
  }
);

// Relaciones
Clients.hasMany(AddressClients, { foreignKey: "id_cliente" }); 
AddressClients.belongsTo(Clients, { foreignKey: "id_cliente" });

module.exports = Clients;
