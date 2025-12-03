import { validationResult } from 'express-validator';
import { sendErrorResponse } from '../utils/response.js';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

