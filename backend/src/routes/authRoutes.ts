import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route to verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router; 