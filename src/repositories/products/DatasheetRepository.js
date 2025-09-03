const Datasheet = require('../../models/products/Datasheet');

const CreateDatasheet = async (datasheet) => {
    return Datasheet.create(datasheet);
}

const getAllDatasheets = async () => {
    return Datasheet.findAll();
}

const GetDatasheetById = async (id) => {
    return Datasheet.findByPk(id);
}

const UpdateDatasheet = async (id, datasheet) => {
    return Datasheet.update(datasheet, { where: { id_ficha_tecnica: id } });
}

const DeleteDatasheet = async (id) => {
    return Datasheet.destroy({ where: { id_ficha_tecnica: id } });
}

module.exports = {
    CreateDatasheet,
    getAllDatasheets,
    GetDatasheetById,
    UpdateDatasheet,
    DeleteDatasheet,
};
