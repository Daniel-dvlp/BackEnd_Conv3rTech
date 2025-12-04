const { cloudinary, deleteImage, extractPublicId } = require('../../config/cloudinary');

const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se han subido imágenes'
            });
        }

        const uploadedImages = req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));

        res.json({
            success: true,
            message: 'Imágenes subidas correctamente',
            images: uploadedImages
        });

    } catch (error) {
        console.error('Error en uploadImages:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir las imágenes',
            error: error.message
        });
    }
};

const deleteImageFromUrl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere la URL de la imagen'
            });
        }

        const publicId = extractPublicId(url);
        if (publicId) {
            await deleteImage(publicId);
        }

        res.json({
            success: true,
            message: 'Imagen eliminada correctamente'
        });

    } catch (error) {
        console.error('Error en deleteImageFromUrl:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la imagen',
            error: error.message
        });
    }
};

module.exports = {
    uploadImages,
    deleteImageFromUrl
};
