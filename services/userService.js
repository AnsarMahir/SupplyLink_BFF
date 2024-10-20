const axios = require('axios');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-north-1' });

const cognito = new AWS.CognitoIdentityServiceProvider();
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
        ClientId: '3046tcigs53nhra0cckta9h7ot',
        Username: username,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: email }],
    };
    return await cognito.signUp(params).promise();
};

exports.signInUser = async (email, password) => {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: 'your-cognito-client-id',
        AuthParameters: { USERNAME: email, PASSWORD: password },
    };
    return await cognito.initiateAuth(params).promise();
};

exports.verifyUser = async (username, code) => {
    const params = {
        ClientId: '3046tcigs53nhra0cckta9h7ot',
        Username: username,
        ConfirmationCode: code,
    };
    const data = await cognito.confirmSignUp(params).promise();

    // Fetch subId from Cognito
    const getUserParams = {
        UserPoolId: 'YOUR_USER_POOL_ID',
        Username: username,
    };
    const userData = await cognito.adminGetUser(getUserParams).promise();
    const subId = userData.UserAttributes.find(attr => attr.Name === 'sub').Value;

    // Save user in microservice
    const saveResponse = await axios.post('http://localhost:8080/api/user/save', { username, subId });
    return saveResponse;
};
