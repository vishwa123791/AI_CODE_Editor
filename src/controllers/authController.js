const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;

async function register(req, res, next) {
  try {
    const { name, email, password } = req.validatedBody;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new ApiError('Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    res.status(201).json({
      accessToken,
      refreshToken,
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    res.json({
      accessToken,
      refreshToken,
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.validatedBody;
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new ApiError('Invalid token type', 401);
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new ApiError('User no longer exists', 401);
    }

    const accessToken = generateAccessToken(user.id, user.email);
    res.json({ accessToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired, please log in again' });
    }
    next(err);
  }
}
async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'name', 'email', 'createdAt', 'lastLoginAt'],
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, getMe };