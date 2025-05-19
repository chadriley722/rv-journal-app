import express, { Request } from 'express';
import { auth } from '../middleware/auth';
import { pool } from '../db';

interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

const router = express.Router();

// Get all journal entries
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user?.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new journal entry
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const { title, content, location } = req.body;
    const entry_text = `${title}\n\n${content}${location ? `\n\nLocation: ${location}` : ''}`;
    
    const result = await pool.query(
      'INSERT INTO journal_entries (user_id, entry_text) VALUES ($1, $2) RETURNING *',
      [req.user?.userId, entry_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get a specific journal entry
router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM journal_entries WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user?.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a journal entry
router.put('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const { title, content, location } = req.body;
    const entry_text = `${title}\n\n${content}${location ? `\n\nLocation: ${location}` : ''}`;
    
    const result = await pool.query(
      'UPDATE journal_entries SET entry_text = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [entry_text, req.params.id, req.user?.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Delete a journal entry
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user?.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 