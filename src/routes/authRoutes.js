const express = require('express');
const router = express.Router();

const { register, login, refresh, getMe } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidator');

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshSchema), refresh);
router.get('/me', authMiddleware, getMe);

module.exports = router;