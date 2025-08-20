const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplier/SupplierController');
const supplierValidations = require('../../middlewares/supplier/SupplierValidations');

router.post('/', supplierValidations.createSupplierValidation, supplierController.createSupplier);
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierValidations.findSupplierByIdValidation, supplierController.getSupplierById);
router.put('/:id', supplierValidations.updateSupplierValidation, supplierController.updateSupplier);
router.delete('/:id', supplierValidations.deleteSupplierValidation, supplierController.deleteSupplier);
router.patch('/:id/state', supplierValidations.changeStateSupplierValidation, supplierController.changeStateSupplier);

module.exports = router;
