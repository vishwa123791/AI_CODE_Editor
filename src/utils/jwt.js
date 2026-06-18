const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(userId, email) {
  return jwt.sign(
    { userId, email, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY }
  );
}

function generateRefreshToken(userId, email) {
  return jwt.sign(
    { userId, email, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };