const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProductCategory = sequelize.define('ProductCategory', {
    id_categoria: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(50), 
        allowNull: false, 
        unique: true,
        validate: {
            len: {
                args: [6, 50],
                msg: "El nombre debe tener más de 5 caracteres"
            }
        }
    },
    descripcion: { 
        type: DataTypes.STRING(250),
        allowNull: true,
        validate: {
            len: {
                args: [10, 250],
                msg: "La descripción debe tener al menos 10 caracteres"
            }
        }
    },
    estado: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true // true = activo, false = inactivo
    }
}, {
    tableName: 'categoria_productos',
    timestamps: false
});

module.exports = ProductCategory;
