const express = require('express');
const router = express.Router();
const datasheetController = require('../../controllers/products/DatasheetController');
const datasheetMiddleware = require('../../middlewares/products/DatasheetMiddleware');

router.get('/', datasheetController.getAllDatasheets);
router.get('/:id', datasheetMiddleware.getDataSheetByIdValidation, datasheetController.getDatasheetById);
router.post('/', datasheetMiddleware.createDataSheetValidation, datasheetController.createDatasheet);
router.put('/:id', datasheetMiddleware.updateDataSheetValidation, datasheetController.updateDatasheet);
router.delete('/:id', datasheetMiddleware.deleteDataSheetValidation, datasheetController.deleteDatasheet);

module.exports = router;