const axios = require('axios');
const {
    SignUpCommand,
    InitiateAuthCommand,
    AdminGetUserCommand,
    ConfirmSignUpCommand,
    GlobalSignOutCommand,
  } = require('@aws-sdk/client-cognito-identity-provider');
  const cognitoClient = require('../utils/awsConfig')

require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const userPoolId = process.env.USER_POOL_ID;



const USER_MICROSERVICE_BASE_URL = 'http://localhost:8080/api/v1/users';

exports.createUser = async (username, email, password) => {
    return await axios.post(`${USER_MICROSERVICE_BASE_URL}`, { username, email, password });
};

exports.getAllUsers = async (page = 0, size = 10) => {
    return await axios.get(`${USER_MICROSERVICE_BASE_URL}?page=${page}&size=${size}`);
};

exports.loginUser = async (username, password) => {
    return await axios.post(`${USER_MICROSERVICE_BASE_URL}/authenticate`, { username, password });
};

exports.getUserProfile = async (token) => {
    return await axios.get(`${USER_MICROSERVICE_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

exports.signUpUser = async (username, email, password) => {
    const params = {
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    };
    const command = new SignUpCommand(params);
    return await cognitoClient.send(command);
  };
  
exports.signInUser = async (req) => {
        const { username, password } = req.body;
        
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: '3046tcigs53nhra0cckta9h7ot', // replace with your actual ClientId
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        };
    
        try {
            
            const data = await cognitoClient.send(new InitiateAuthCommand(params));
            console.log(data);
            return {
                accessToken: data.AuthenticationResult.AccessToken,
                idToken: data.AuthenticationResult.IdToken,
                refreshToken: data.AuthenticationResult.RefreshToken,
                isVerified: true
            };
        } catch (error) {
            if (error.name === 'UserNotConfirmedException') {
                return { isVerified: false, name:error.name };  // User not confirmed
            }
            console.log("Serive error" + error);
            return { isVerified: false, name:error.name };  // Rethrow other errors
        }
    }



  exports.verifyUser = async (req) => {
    const {username, code} = req.body;
    const params = {
      ClientId: '3046tcigs53nhra0cckta9h7ot',
      Username: username,
      ConfirmationCode: code,
    };
    const confirmCommand = new ConfirmSignUpCommand(params);
    await cognitoClient.send(confirmCommand);
  
    const getUserParams = {
      UserPoolId: 'eu-north-1_MAMG3ECOK',
      Username: username,
    };
    const userCommand = new AdminGetUserCommand(getUserParams);
    const userData = await cognitoClient.send(userCommand);
    const subId = userData.UserAttributes.find((attr) => attr.Name === 'sub').Value;
  console.log(subId);
    const saveResponse = await axios.post('http://localhost:8080/api/v1/user/save', { username, subId });
    return saveResponse;
  };

// services/userService.js

exports.logoutUser = async (accessToken) => {
    const params = { AccessToken: accessToken };
    const logoutCommand = new GlobalSignOutCommand(params);
  
    try {
      await cognitoClient.send(logoutCommand);
      return { message: 'User logged out successfully' };
    } catch (err) {
      throw new Error('Failed to logout: ' + err.message);
    }
  };
  

