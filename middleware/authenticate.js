const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = await User.findByPk(decoded.userId);
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};
