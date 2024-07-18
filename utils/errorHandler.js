// utils/errorHandler.js
const handleError = (error, res, defaultMessage) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || defaultMessage;
  
      res.status(status).json({ message, error: error.response.data });
    } else {
      res.status(500).json({ message: defaultMessage, error });
    }
  };
  
  module.exports = handleError;
  