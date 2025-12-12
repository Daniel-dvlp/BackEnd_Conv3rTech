const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

// Importar modelos relacionados
const Service = require("../services/Service");
const Client = require("../clients/Clients"); // <-- cliente
const User = require("../users/Users"); // <-- usuario

const AddressClients = require("../clients/AddressClients"); // <-- direccion cliente

const Appointment = sequelize.define(
  "Appointment",
  {
    id_cita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: true, // Puede ser null si se usa el campo de texto antiguo, pero preferimos este
      references: {
        model: AddressClients,
        key: "id_direccion",
      },
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true, // Mantener por compatibilidad o como fallback
    },
    observaciones: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    evidencia_foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "URL de la foto subida por el técnico al completar la cita",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_usuario", // ajusta si tu PK en User es diferente
      },
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id_cliente", // ajusta si tu PK en Clients es diferente
      },
    },
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Service,
        key: "id_servicio", // PK correcta en Service
      },
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "Confirmada", "Cancelada", "Completada"),
      defaultValue: "Pendiente",
    },
  },
  {
    tableName: "citas",
    timestamps: false,
  }
);

// Relaciones
Appointment.associate = (models) => {
  Appointment.belongsTo(models.User, {
    foreignKey: "id_usuario",
    as: "trabajador",
  });
  Appointment.belongsTo(models.Clients, {
    foreignKey: "id_cliente",
    as: "cliente",
  });
  Appointment.belongsTo(models.Service, {
    foreignKey: "id_servicio",
    as: "servicio",
  });
  Appointment.belongsTo(models.AddressClients, {
    foreignKey: "id_direccion",
    as: "direccion_cliente",
  });
};

module.exports = Appointment;

/*
id_cliente → Cliente que recibe el servicio.

id_usuario → Trabajador que atiende la cita.

id_servicio → El servicio solicitado.
*/