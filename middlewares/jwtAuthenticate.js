const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';  // Replace this with an environment variable in production

// JWT Authentication Middleware
const jwtAuthenticate = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);

        // Attach the user info (or claims) to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = jwtAuthenticate;
