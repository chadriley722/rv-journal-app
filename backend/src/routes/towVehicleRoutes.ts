import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUserTowVehicles,
  getTowVehicle,
  createTowVehicle,
  updateTowVehicle,
  deleteTowVehicle,
} from '../controllers/towVehicleController';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all tow vehicles for the authenticated user
router.get('/', getUserTowVehicles);

// Get a specific tow vehicle
router.get('/:id', getTowVehicle);

// Create a new tow vehicle
router.post('/', createTowVehicle);

// Update a tow vehicle
router.put('/:id', updateTowVehicle);

// Delete a tow vehicle
router.delete('/:id', deleteTowVehicle);

export default router; 