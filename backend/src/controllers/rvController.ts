import { Request, Response } from 'express';
import { pool } from '../db';
import { eq } from 'drizzle-orm';
import { rvs } from '../schema';

export const rvController = {
  // Get all RVs for a user
  async getUserRVs(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        'SELECT * FROM rvs WHERE user_id = $1 ORDER BY is_current DESC, created_at DESC',
        [userId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user RVs:', error);
      res.status(500).json({ error: 'Server error fetching RVs' });
    }
  },

  // Add a new RV
  async addRV(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, make, model, year, description, is_current } = req.body;

      // If this is marked as current, update other RVs to not current
      if (is_current) {
        await pool.query(
          'UPDATE rvs SET is_current = false WHERE user_id = $1',
          [userId]
        );
      }

      const result = await pool.query(
        `INSERT INTO rvs (user_id, name, make, model, year, description, is_current)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, name, make, model, year, description, is_current]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding RV:', error);
      res.status(500).json({ error: 'Server error adding RV' });
    }
  },

  // Update an RV
  async updateRV(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const rvId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, make, model, year, description, is_current } = req.body;

      // If this is marked as current, update other RVs to not current
      if (is_current) {
        await pool.query(
          'UPDATE rvs SET is_current = false WHERE user_id = $1 AND id != $2',
          [userId, rvId]
        );
      }

      const result = await pool.query(
        `UPDATE rvs 
         SET name = $1, make = $2, model = $3, year = $4, description = $5, is_current = $6, updated_at = NOW()
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [name, make, model, year, description, is_current, rvId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'RV not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating RV:', error);
      res.status(500).json({ error: 'Server error updating RV' });
    }
  },

  // Delete an RV
  async deleteRV(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const rvId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        'DELETE FROM rvs WHERE id = $1 AND user_id = $2 RETURNING *',
        [rvId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'RV not found' });
      }

      res.json({ message: 'RV deleted successfully' });
    } catch (error) {
      console.error('Error deleting RV:', error);
      res.status(500).json({ error: 'Server error deleting RV' });
    }
  }
}; 