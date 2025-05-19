import { Request, Response } from 'express';
import { pool } from '../db';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, email, username, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error fetching user' });
  }
}; 