import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all users (protected route)
router.get('/', auth, getAllUsers);

// Get user by ID (protected route)
router.get('/:id', auth, getUserById);

export default router; 