import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { db } from '../db';
import { rvs } from '../schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's RVs
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRVs = await db.query.rvs.findMany({
      where: eq(rvs.user_id, userId),
      orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
    });

    res.json(userRVs);
  } catch (error) {
    console.error('Error fetching user RVs:', error);
    res.status(500).json({ error: 'Server error fetching RVs' });
  }
});

// Add new RV
router.post('/me', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, make, model, year, description, is_current } = req.body;

    // If this RV is marked as current, unmark all other RVs
    if (is_current) {
      await db.update(rvs)
        .set({ is_current: false })
        .where(eq(rvs.user_id, userId));
    }

    const [newRV] = await db.insert(rvs)
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

    // Get updated list of RVs
    const userRVs = await db.query.rvs.findMany({
      where: eq(rvs.user_id, userId),
      orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
    });

    res.status(201).json({
      ...newRV,
      rvs: userRVs
    });
  } catch (error) {
    console.error('Error adding RV:', error);
    res.status(500).json({ error: 'Server error adding RV' });
  }
});

// Update RV
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rvId = parseInt(req.params.id);
    const { name, make, model, year, description, is_current } = req.body;

    // If this RV is marked as current, unmark all other RVs
    if (is_current) {
      await db.update(rvs)
        .set({ is_current: false })
        .where(eq(rvs.user_id, userId));
    }

    const [updatedRV] = await db.update(rvs)
      .set({
        name,
        make,
        model,
        year,
        description,
        is_current,
        updated_at: new Date()
      })
      .where(eq(rvs.id, rvId))
      .returning();

    if (!updatedRV) {
      return res.status(404).json({ error: 'RV not found' });
    }

    // Get updated list of RVs
    const userRVs = await db.query.rvs.findMany({
      where: eq(rvs.user_id, userId),
      orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
    });

    res.json({
      ...updatedRV,
      rvs: userRVs
    });
  } catch (error) {
    console.error('Error updating RV:', error);
    res.status(500).json({ error: 'Server error updating RV' });
  }
});

// Delete RV
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rvId = parseInt(req.params.id);
    const [deletedRV] = await db.delete(rvs)
      .where(eq(rvs.id, rvId))
      .returning();

    if (!deletedRV) {
      return res.status(404).json({ error: 'RV not found' });
    }

    // Get updated list of RVs
    const userRVs = await db.query.rvs.findMany({
      where: eq(rvs.user_id, userId),
      orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
    });

    res.json({
      message: 'RV deleted successfully',
      rvs: userRVs
    });
  } catch (error) {
    console.error('Error deleting RV:', error);
    res.status(500).json({ error: 'Server error deleting RV' });
  }
});

export default router; 