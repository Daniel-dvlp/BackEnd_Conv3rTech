const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PagosAbonos = sequelize.define("pagos_abonos", {
  id_pago_abono: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_proyecto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_venta: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  monto: { // Este campo almacena el monto para este pago específico.
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01 // Asegura que el pago sea un valor positivo.
    }
  },
  metodo_pago: {
    type: DataTypes.ENUM("Efectivo", "Transferencia", "Tarjeta", "Cheque"),
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "pagos_abonos",
  timestamps: false,
  underscored: true
});

module.exports = PagosAbonos;