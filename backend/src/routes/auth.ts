import express from 'express';
import { register, login, validateRegistration, validateLogin } from '../controllers/authController';

const router = express.Router();

// Register route
router.post('/register', validateRegistration, register);

// Login route
router.post('/login', validateLogin, login);

export default router; 