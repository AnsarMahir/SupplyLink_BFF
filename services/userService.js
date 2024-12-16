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

const CLIENT_ID = process.env.CLIENT_ID;
const USER_POOL_ID = process.env.USER_POOL_ID;


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

exports.signUpUser = async (username, email, password,Role) => {
    const params = {
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }, {
        Name: "custom:Role", // Ensure the custom attribute is prefixed with `custom:`
        Value: Role,
    }],
    };
    const command = new SignUpCommand(params);
    return await cognitoClient.send(command);
  };

 

  // exports.signUpUser = async (username, email, password) => {
  //   try {
  //     // Cognito signup process
  //     const params = {
  //       ClientId: CLIENT_ID,
  //       Username: username,
  //       Password: password,
  //       UserAttributes: [{ Name: 'email', Value: email }],
  //     };
  //     const command = new SignUpCommand(params);
  //     const cognotoResponse = await cognitoClient.send(command);
  
  //     // Extract subId from Cognito response (typically the sub attribute)
  //     const subId = cognotoResponse.UserSub;
  
  //     // Prepare user object to send to user microservice
  //     const userPayload = {
  //       subId: subId,
  //       userConfirmed: false, // Initially set to false
  //       refreshToken: null // You might want to handle refresh token separately
  //     };
  
     
  //     const userServiceResponse = await axios.post('http://localhost:8083/api/v1/users', userPayload);
  
  //     console.log(userServiceResponse);
  //     return  cognotoResponse;
     
  //   } catch (error) {
  //     console.error('Signup process failed', error);
  //     throw error;
  //   }
  // };
  
exports.signInUser = async (req) => {
        const { username, password } = req.body;
        
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID, // replace with your actual ClientId
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
    let {username, otp} = req.body;
    username = username.toLowerCase();
    const params = {
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: otp,
    };
    const confirmCommand = new ConfirmSignUpCommand(params);
    await cognitoClient.send(confirmCommand);
  
  //   const getUserParams = {
  //     UserPoolId: USER_POOL_ID,
  //     Username: username,
  //   };
  //   const userCommand = new AdminGetUserCommand(getUserParams);
  //   const userData = await cognitoClient.send(userCommand);
  //   const subId = userData.UserAttributes.find((attr) => attr.Name === 'sub').Value;
  // console.log(subId);
  //   const saveResponse = await axios.post('http://localhost:8080/api/v1/user/save', { username, subId });
  //   return saveResponse;
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
  

