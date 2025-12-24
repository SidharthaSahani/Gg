// src/utils/responseHelper.js
// Standardized API response helpers

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: error.message || error
  });
};

const sendCreated = (res, data, message = 'Resource created successfully') => {
  sendSuccess(res, data, message, 201);
};

// Convert MongoDB _id to id for frontend
const formatDocument = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
};

const formatDocuments = (docs) => {
  return docs.map(formatDocument);
};

module.exports = {
  sendSuccess,
  sendError,
  sendCreated,
  formatDocument,
  formatDocuments
};