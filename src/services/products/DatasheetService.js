const DatasheetRepository = require('../../repositories/products/DatasheetRepository');

const createDatasheet = async (datasheet) => {
    return DatasheetRepository.CreateDatasheet(datasheet);
}

const getAllDatasheets = async () => {
    return DatasheetRepository.getAllDatasheets();
}

const getDatasheetById = async (id) => {
    return DatasheetRepository.GetDatasheetById(id);
}

const updateDatasheet = async (id, datasheet) => {
    return DatasheetRepository.UpdateDatasheet(id, datasheet);
}

const deleteDatasheet = async (id) => {
    return DatasheetRepository.DeleteDatasheet(id);
}

module.exports = {
    createDatasheet,
    getAllDatasheets,
    getDatasheetById,
    updateDatasheet,
    deleteDatasheet
};
