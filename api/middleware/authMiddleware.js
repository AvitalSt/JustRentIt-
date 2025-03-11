const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    return res.status(403).send({ message: 'Invalid or expired token' });
  }
};
module.exports = { authenticateToken };