const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-north-1',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-north-1_MAMG3ECOK', 
  }),
});

const cognito = new AWS.CognitoIdentityServiceProvider();
