const jwt = require('jwt-simple');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = parts;

    try {
      // Decode token using JWT_SECRET
      const decoded = jwt.decode(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed' });
  }
};

module.exports = authMiddleware;
