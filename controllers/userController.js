const axios = require('axios');
const handleError = require('../utils/errorHandler');

// User Microservice URL (change this based on your environment)
const USER_MICROSERVICE_BASE_URL = 'http://localhost:8080/api/v1/users';

// Route for user signup
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Make a POST request to the User microservice for user registration
        const response = await axios.post(`${USER_MICROSERVICE_BASE_URL}`, {
            username,
            email,
            password
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ error: 'Signup failed' });
    }
};

// Route for getting all users
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 0, size = 10 } = req.query;
        const response = await axios.get(`${USER_MICROSERVICE_BASE_URL}?page=${page}&size=${size}`);

        res.status(200).json(response.data);
    } catch (error) {
        handleError(error, res, 'Error fetching users');
    }
};

// Route for user login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Make a POST request to authenticate the user
        const response = await axios.post(`${USER_MICROSERVICE_BASE_URL}/authenticate`, {
            username,
            password
        });

        // Return the token from the User microservice
        res.status(200).json({ token: response.data.token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ error: 'Login failed' });
    }
};

// Route for getting user profile (requires JWT)
exports.getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  // Extract token from the Authorization header

        // Make a GET request to the User microservice with JWT token
        const response = await axios.get(`${USER_MICROSERVICE_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error during profile fetching:', error.message);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

//
exports.signInUser = async (req, res, next) => {
  const { email, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: 'your-cognito-client-id',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const data = await cognito.initiateAuth(params).promise();
    res.status(200).json({ message: 'User signed in successfully', token: data.AuthenticationResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-north-1'  
});

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.signUpUser = async (req, res, next) => {
  const { username,email, password } = req.body;

  const params = {
    ClientId: '3046tcigs53nhra0cckta9h7ot',  
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    const data = await cognito.signUp(params).promise();
    res.status(200).json({ message: 'User signed up successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signInUser = async (req, res, next) => {
    const { email, password } = req.body;
  
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: 'your-cognito-client-id',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
  
    try {
      const data = await cognito.initiateAuth(params).promise();
      res.status(200).json({ message: 'User signed in successfully', token: data.AuthenticationResult });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  