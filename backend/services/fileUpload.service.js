import { uploadToCloudinary, deleteFromCloudinary } from '../configs/cloudinary.js';
import logger from '../configs/logger.js';

export const uploadFile = async (file, folder = 'ait-platform') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, folder);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    logger.error('File upload error:', error);
    throw error;
  }
};

export const deleteFile = async (publicId) => {
  try {
    const result = await deleteFromCloudinary(publicId);
    return { success: true, result };
  } catch (error) {
    logger.error('File delete error:', error);
    throw error;
  }
};

export const uploadMultipleFiles = async (files, folder = 'ait-platform') => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, folder));
    const results = await Promise.all(uploadPromises);
    return { success: true, files: results };
  } catch (error) {
    logger.error('Multiple file upload error:', error);
    throw error;
  }
};

