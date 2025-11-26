const { deleteImage, extractPublicId } = require('../../config/cloudinary');

/**
 * Sube múltiples imágenes a Cloudinary
 * Las imágenes ya fueron procesadas por multer y están en req.files
 */
const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                message: 'No se recibieron imágenes para subir' 
            });
        }

        // Extraer las URLs de las imágenes subidas
        const urls = req.files.map(file => file.path);

        res.status(200).json({
            message: 'Imágenes subidas exitosamente',
            urls: urls,
            count: urls.length
        });
    } catch (error) {
        console.error('Error al subir imágenes:', error);
        
        // Si hay error, intentar eliminar las imágenes subidas
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const publicId = extractPublicId(file.path);
                    if (publicId) {
                        await deleteImage(publicId);
                    }
                } catch (deleteError) {
                    console.error('Error al eliminar imagen:', deleteError);
                }
            }
        }
        
        res.status(500).json({ 
            message: 'Error al subir imágenes',
            error: error.message 
        });
    }
};

/**
 * Elimina una imagen de Cloudinary
 */
const deleteImageFromUrl = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ 
                message: 'URL de imagen no proporcionada' 
            });
        }

        const publicId = extractPublicId(imageUrl);
        
        if (!publicId) {
            return res.status(400).json({ 
                message: 'No se pudo extraer el ID de la imagen' 
            });
        }

        const result = await deleteImage(publicId);

        if (result.result === 'ok' || result.result === 'not found') {
            res.status(200).json({
                message: 'Imagen eliminada exitosamente',
                success: true
            });
        } else {
            res.status(400).json({
                message: 'No se pudo eliminar la imagen',
                success: false
            });
        }
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({ 
            message: 'Error al eliminar imagen',
            error: error.message,
            success: false
        });
    }
};

module.exports = {
    uploadImages,
    deleteImageFromUrl
};