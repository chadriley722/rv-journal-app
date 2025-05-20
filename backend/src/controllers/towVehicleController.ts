import { Request, Response } from 'express';
import { db } from '../db';
import { tow_vehicles } from '../schema';
import { eq, and } from 'drizzle-orm';

// Get all tow vehicles for a user
export const getUserTowVehicles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicles = await db
      .select()
      .from(tow_vehicles)
      .where(eq(tow_vehicles.user_id, userId));

    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching tow vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch tow vehicles' });
  }
};

// Get a specific tow vehicle
export const getTowVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicle = await db
      .select()
      .from(tow_vehicles)
      .where(
        and(
          eq(tow_vehicles.id, Number(id)),
          eq(tow_vehicles.user_id, userId)
        )
      )
      .limit(1);

    if (vehicle.length === 0) {
      return res.status(404).json({ error: 'Tow vehicle not found' });
    }

    res.json(vehicle[0]);
  } catch (error) {
    console.error('Error fetching tow vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch tow vehicle' });
  }
};

// Create a new tow vehicle
export const createTowVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, make, model, year, description } = req.body;

    // Validate required fields
    if (!name || !make || !model || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If this is marked as current, update other vehicles to not current
    if (req.body.is_current) {
      await db
        .update(tow_vehicles)
        .set({ is_current: false })
        .where(eq(tow_vehicles.user_id, userId));
    }

    const [newVehicle] = await db
      .insert(tow_vehicles)
      .values({
        user_id: userId,
        name,
        make,
        model,
        year: Number(year),
        description,
        is_current: req.body.is_current ?? true,
      })
      .returning();

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error creating tow vehicle:', error);
    res.status(500).json({ error: 'Failed to create tow vehicle' });
  }
};

// Update a tow vehicle
export const updateTowVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, make, model, year, description, is_current } = req.body;

    // If this is being marked as current, update other vehicles
    if (is_current) {
      await db
        .update(tow_vehicles)
        .set({ is_current: false })
        .where(eq(tow_vehicles.user_id, userId));
    }

    const [updatedVehicle] = await db
      .update(tow_vehicles)
      .set({
        name,
        make,
        model,
        year: year ? Number(year) : undefined,
        description,
        is_current,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(tow_vehicles.id, Number(id)),
          eq(tow_vehicles.user_id, userId)
        )
      )
      .returning();

    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Tow vehicle not found' });
    }

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating tow vehicle:', error);
    res.status(500).json({ error: 'Failed to update tow vehicle' });
  }
};

// Delete a tow vehicle
export const deleteTowVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [deletedVehicle] = await db
      .delete(tow_vehicles)
      .where(
        and(
          eq(tow_vehicles.id, Number(id)),
          eq(tow_vehicles.user_id, userId)
        )
      )
      .returning();

    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Tow vehicle not found' });
    }

    res.json({ message: 'Tow vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting tow vehicle:', error);
    res.status(500).json({ error: 'Failed to delete tow vehicle' });
  }
}; 