const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');
const { defaultProvider } = require('@aws-sdk/credential-providers');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Cognito Client with defaultProvider to handle credentials
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: defaultProvider,
});

module.exports = cognitoClient;
