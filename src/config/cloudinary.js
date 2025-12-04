const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const uploadProductImages = multer({ storage: storage });

const extractPublicId = (url) => {
    try {
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        const publicId = lastPart.split('.')[0];
        return publicId;
    } catch (error) {
        console.error('Error extrayendo public_id:', error);
        return null;
    }
};

const deleteImage = async (publicId) => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error eliminando imagen de Cloudinary:', error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadProductImages,
    extractPublicId,
    deleteImage
};
