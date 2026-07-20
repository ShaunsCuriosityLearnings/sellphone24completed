import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sellyourphone24', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1000, crop: 'limit' },
      { quality: 'auto' }
    ],
  },
});

const upload = multer({ storage: storage });

export default upload;
