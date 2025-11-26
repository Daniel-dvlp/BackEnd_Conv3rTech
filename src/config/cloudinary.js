const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmtjht9ie',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de almacenamiento para productos
const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'conv3rtech/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
        ]
    }
});

// Middleware de Multer para productos
const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo por imagen
    }
});

// Función para eliminar imagen de Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error al eliminar imagen de Cloudinary:', error);
        throw error;
    }
};

// Función para extraer public_id de una URL de Cloudinary
const extractPublicId = (imageUrl) => {
    try {
        // Ejemplo: https://res.cloudinary.com/dmtjht9ie/image/upload/v1234567890/conv3rtech/products/abc123.jpg
        const parts = imageUrl.split('/');
        const uploadIndex = parts.indexOf('upload');
        
        if (uploadIndex === -1) return null;
        
        // Obtener la parte después de 'upload' y la versión (v1234567890)
        const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');
        
        // Remover la extensión del archivo
        const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
        
        return publicId;
    } catch (error) {
        console.error('Error al extraer public_id:', error);
        return null;
    }
};

module.exports = {
    cloudinary,
    uploadProductImages,
    deleteImage,
    extractPublicId
};