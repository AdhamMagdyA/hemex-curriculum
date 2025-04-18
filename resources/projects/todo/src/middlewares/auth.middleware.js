const AuthService = require('../services/auth.service');

function authenticate(req, res, next) {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    // 2. Verify token
    const decoded = AuthService.verifyToken(token);
    
    // 3. Attach user to request
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
