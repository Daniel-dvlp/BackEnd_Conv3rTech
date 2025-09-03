const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Purchase = sequelize.define('Purchase', {
    // ... tus atributos aquí
    id_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_recibo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'compositeIndex'
    },
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'compositeIndex'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.ENUM('Registrada', 'Anulada', 'Completada'),
        defaultValue: 'Registrada'
    },
    fecha_recibo: {
        type: DataTypes.DATE,
        allowNull: false
    },
    iva: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    }
}, {
    tableName: 'compras',
    timestamps: false
});

// Definir las asociaciones después de que los modelos han sido registrados en Sequelize
Purchase.associate = (models) => {
    // Asociación con el modelo de Proveedor
    Purchase.belongsTo(models.Supplier, {
        foreignKey: 'id_proveedor',
        as: 'supplier'
    });
    // Asociación con el modelo de Detalle de Compra
    Purchase.hasMany(models.PurchaseDetail, {
        foreignKey: 'id_compra',
        as: 'purchaseDetails'
    });
};

module.exports = Purchase;