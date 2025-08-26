const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const AddressClients = require("./AddressClients");

const Clients = sequelize.define(
  "Clients",
  {
    id_client: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    document: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    type_document: {
      type: DataTypes.ENUM("CC", "CE", "PPT", "NIT", "PA"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    credit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stateClient: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "clients",
    timestamps: false,
    underscored: true,
  }
);

// Relaciones
Clients.hasMany(AddressClients, { foreignKey: "id_client" }); 
AddressClients.belongsTo(Clients, { foreignKey: "id_client" });

module.exports = Clients;
