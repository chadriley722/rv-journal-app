import express from 'express';
import { rvController } from '../controllers/rvController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all RVs for the authenticated user
router.get('/', rvController.getUserRVs);

// Add a new RV
router.post('/', rvController.addRV);

// Update an RV
router.patch('/:id', rvController.updateRV);

// Delete an RV
router.delete('/:id', rvController.deleteRV);

export default router; 