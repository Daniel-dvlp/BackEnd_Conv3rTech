const FeatureRepository = require('../../repositories/products/FeatureRepository');

const createFeature = async (feature) =>{
    return FeatureRepository.CreateFeature(feature);
}

const getAllFeatures = async () =>{
    return FeatureRepository.getAllFeatures();
}

const getFeatureById = async (id) =>{
    return FeatureRepository.GetFeatureById(id);
}

const updateFeature = async (id, feature) =>{
    return FeatureRepository.UpdateFeature(id, feature);
}

const deleteFeature = async (id) =>{
    return FeatureRepository.DeleteFeature(id);
}

module.exports = {
    createFeature,
    getAllFeatures,
    getFeatureById,
    updateFeature,
    deleteFeature
};
