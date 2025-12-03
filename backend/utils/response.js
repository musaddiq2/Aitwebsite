// Standardized response utility

export const sendSuccessResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data })
  });
};

export const sendErrorResponse = (res, statusCode = 500, message = 'Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

export const sendPaginatedResponse = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    data,
    pagination
  });
};

