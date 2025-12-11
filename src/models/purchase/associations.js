const Purchase = require('./PurchaseModel');
const PurchaseDetail = require('./PurchaseDetailModel');
const Supplier = require('../supplier/SupplierModel');
const Product = require('../products/Product');

// Definir asociaciones
Supplier.hasMany(Purchase, { foreignKey: 'id_proveedor', as: 'purchases' });
Purchase.belongsTo(Supplier, { foreignKey: 'id_proveedor', as: 'supplier' });

Purchase.hasMany(PurchaseDetail, { foreignKey: 'id_compra', as: 'purchaseDetails' });
PurchaseDetail.belongsTo(Purchase, { foreignKey: 'id_compra', as: 'purchase' });

Product.hasMany(PurchaseDetail, { foreignKey: 'id_producto', as: 'purchaseDetails' });
PurchaseDetail.belongsTo(Product, { foreignKey: 'id_producto', as: 'product' });

module.exports = { Purchase, PurchaseDetail, Supplier, Product };
