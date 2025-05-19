import express from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/me', userController.getProfile);

// Update user profile
router.patch('/me', userController.updateProfile);

export default router; 