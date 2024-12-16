const userService = require('../services/userService');
const handleError = require('../utils/errorHandler');


exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const response = await userService.createUser(username, email, password);
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ error: 'Signup failed' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 0, size = 10 } = req.query;
        const response = await userService.getAllUsers(page, size);
        res.status(200).json(response.data);
    } catch (error) {
        handleError(error, res, 'Error fetching users');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await userService.loginUser(username, password);
        res.status(200).json({ token: response.data.token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ error: 'Login failed' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const response = await userService.getUserProfile(token);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error during profile fetching:', error.message);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

exports.signUpUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const Role = "User";
        const data = await userService.signUpUser(username, email, password,Role);
        console.log(data);
        res.status(200).json({ message: 'User signed up successfully', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.signInUser = async (req, res) => {
    try {
        const response = await userService.signInUser(req);
        if (response.isVerified===false) {
            return res.status(403).json({
                message: response.name,
                isVerified:response.isVerified
            });
        }

        // Send tokens if the user is verified
        res.status(200).json({
            message: 'User signed in successfully',
            accessToken: response.accessToken,
            idToken: response.idToken,
            refreshToken: response.refreshToken,
            isVerified: true
        });
    } catch (err) {
        console.log("Controller error");
        return err;
    }
};


exports.verifyUser = async (req, res) => {
    try {
        const saveResponse = await userService.verifyUser(req);
        res.status(200).json({ message: 'User verified and saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// controllers/userController.js

exports.logoutUser = async (req, res) => {
  try {
      // Extract the Cognito AccessToken from the Authorization header
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // Format: "Bearer <token>"

      if (!token) {
          return res.status(400).json({ message: 'No token provided' });
      }

      // Call the service to logout the user
      const response = await userService.logoutUser(token);

      // Return a success response
      res.status(200).json(response);
  } catch (err) {
      res.status(500).json({ error: 'Logout failed: ' + err.message });
  }
};
