const axios = require('axios');

const NOTIFICATION_SERVICE_URL = 'http://localhost:8090/api/notifications';

const sendNotification = async (message, type = 'ALERT', recipient = 'browser') => {
  try {
    const notification = {
      recipient,
      message,
      type
    };
    await axios.post(`${NOTIFICATION_SERVICE_URL}/send`, notification);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

module.exports = {
  sendNotification
};
