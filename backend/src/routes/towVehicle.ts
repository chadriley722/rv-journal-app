import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { db } from '../db';
import { tow_vehicles } from '../schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's tow vehicles
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userTowVehicles = await db.query.tow_vehicles.findMany({
      where: eq(tow_vehicles.user_id, userId),
      orderBy: (tow_vehicles, { desc }) => [desc(tow_vehicles.is_current), desc(tow_vehicles.created_at)]
    });

    res.json(userTowVehicles);
  } catch (error) {
    console.error('Error fetching user tow vehicles:', error);
    res.status(500).json({ error: 'Server error fetching tow vehicles' });
  }
});

// Add new tow vehicle
router.post('/me', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, make, model, year, description, is_current } = req.body;

    // If this vehicle is marked as current, unmark all other vehicles
    if (is_current) {
      await db.update(tow_vehicles)
        .set({ is_current: false })
        .where(eq(tow_vehicles.user_id, userId));
    }

    const [newVehicle] = await db.insert(tow_vehicles)
      .values({
        user_id: userId,
        name,
        make,
        model,
        year,
        description,
        is_current: is_current ?? true
      })
      .returning();

    // Get updated list of tow vehicles
    const userTowVehicles = await db.query.tow_vehicles.findMany({
      where: eq(tow_vehicles.user_id, userId),
      orderBy: (tow_vehicles, { desc }) => [desc(tow_vehicles.is_current), desc(tow_vehicles.created_at)]
    });

    res.status(201).json({
      ...newVehicle,
      tow_vehicles: userTowVehicles
    });
  } catch (error) {
    console.error('Error adding tow vehicle:', error);
    res.status(500).json({ error: 'Server error adding tow vehicle' });
  }
});

// Update tow vehicle
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicleId = parseInt(req.params.id);
    const { name, make, model, year, description, is_current } = req.body;

    // If this vehicle is marked as current, unmark all other vehicles
    if (is_current) {
      await db.update(tow_vehicles)
        .set({ is_current: false })
        .where(eq(tow_vehicles.user_id, userId));
    }

    const [updatedVehicle] = await db.update(tow_vehicles)
      .set({
        name,
        make,
        model,
        year,
        description,
        is_current,
        updated_at: new Date()
      })
      .where(eq(tow_vehicles.id, vehicleId))
      .returning();

    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Tow vehicle not found' });
    }

    // Get updated list of tow vehicles
    const userTowVehicles = await db.query.tow_vehicles.findMany({
      where: eq(tow_vehicles.user_id, userId),
      orderBy: (tow_vehicles, { desc }) => [desc(tow_vehicles.is_current), desc(tow_vehicles.created_at)]
    });

    res.json({
      ...updatedVehicle,
      tow_vehicles: userTowVehicles
    });
  } catch (error) {
    console.error('Error updating tow vehicle:', error);
    res.status(500).json({ error: 'Server error updating tow vehicle' });
  }
});

// Delete tow vehicle
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicleId = parseInt(req.params.id);
    const [deletedVehicle] = await db.delete(tow_vehicles)
      .where(eq(tow_vehicles.id, vehicleId))
      .returning();

    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Tow vehicle not found' });
    }

    // Get updated list of tow vehicles
    const userTowVehicles = await db.query.tow_vehicles.findMany({
      where: eq(tow_vehicles.user_id, userId),
      orderBy: (tow_vehicles, { desc }) => [desc(tow_vehicles.is_current), desc(tow_vehicles.created_at)]
    });

    res.json({
      message: 'Tow vehicle deleted successfully',
      tow_vehicles: userTowVehicles
    });
  } catch (error) {
    console.error('Error deleting tow vehicle:', error);
    res.status(500).json({ error: 'Server error deleting tow vehicle' });
  }
});

export default router; 