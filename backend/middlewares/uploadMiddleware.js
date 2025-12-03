import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../configs/logger.js';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    
    if (file.fieldname === 'passportPhoto' || file.fieldname === 'photo') {
      folder = 'photos';
    } else if (file.fieldname === 'aadhaarCard' || file.fieldname === 'aadhaar') {
      folder = 'documents';
    } else if (file.fieldname === 'certificate') {
      folder = 'certificates';
    }
    
    const dir = path.join(uploadDir, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf']
  };

  const fileType = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes[fileType] && allowedTypes[fileType].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Multiple upload handlers
export const uploadPhoto = upload.single('passportPhoto');
export const uploadDocument = upload.single('aadhaarCard');
export const uploadCertificate = upload.single('certificate');
export const uploadMultiple = upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 }
]);

