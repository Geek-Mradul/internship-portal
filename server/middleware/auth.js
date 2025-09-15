// server/middleware/auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from the "Authorization: Bearer <token>" header
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to the request object
        req.user = decoded;
        next(); // Proceed to the next step (e.g., the route handler)
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = auth;