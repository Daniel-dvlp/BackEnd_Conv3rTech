const Feature = require('../../models/products/Feature');

const CreateFeature = async (feature) =>{
    return Feature.create(feature);
}

const getAllFeatures = async () =>{
    return Feature.findAll();
}

const GetFeatureById = async (id) =>{
    return Feature.findByPk(id);
}

const UpdateFeature = async (id, feature) =>{
    return Feature.update(feature, { where: { id_caracteristica: id } });
}

const DeleteFeature = async (id) =>{
    return Feature.destroy({ where: { id_caracteristica: id } });
}

module.exports = {
    CreateFeature,
    getAllFeatures,
    GetFeatureById,
    UpdateFeature,
    DeleteFeature,
};
