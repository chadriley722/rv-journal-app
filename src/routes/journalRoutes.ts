import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db';
import { journal_entries } from '../schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const router = Router();

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Validation middleware
const validateEntry = [
  body('entry_text')
    .trim()
    .notEmpty()
    .withMessage('Entry text is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Entry must be between 1 and 10000 characters'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  body('weather')
    .optional()
    .isString()
    .withMessage('Weather must be a string')
];

// Get all entries for the authenticated user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const entries = await db.select()
      .from(journal_entries)
      .where(eq(journal_entries.user_id, req.user.userId))
      .orderBy(journal_entries.created_at);

    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Server error fetching entries' });
  }
});

// Get a specific entry
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const entryId = parseInt(req.params.id);
    const entry = await db.select()
      .from(journal_entries)
      .where(eq(journal_entries.id, entryId))
      .where(eq(journal_entries.user_id, req.user.userId));

    if (entry.length === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry[0]);
  } catch (err) {
    console.error('Error fetching entry:', err);
    res.status(500).json({ error: 'Server error fetching entry' });
  }
});

// Create a new entry
router.post('/', authenticateToken, validateEntry, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { entry_text, location, weather } = req.body;
    const newEntry = await db.insert(journal_entries).values({
      user_id: req.user.userId,
      entry_text,
      location,
      weather,
    }).returning();

    res.status(201).json(newEntry[0]);
  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).json({ error: 'Server error creating entry' });
  }
});

// Update an entry
router.put('/:id', authenticateToken, validateEntry, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entryId = parseInt(req.params.id);
    const { entry_text, location, weather } = req.body;

    // Check if entry exists and belongs to user
    const existingEntry = await db.select()
      .from(journal_entries)
      .where(eq(journal_entries.id, entryId))
      .where(eq(journal_entries.user_id, req.user.userId));

    if (existingEntry.length === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const updatedEntry = await db.update(journal_entries)
      .set({
        entry_text,
        location,
        weather,
        updated_at: new Date()
      })
      .where(eq(journal_entries.id, entryId))
      .returning();

    res.json(updatedEntry[0]);
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).json({ error: 'Server error updating entry' });
  }
});

// Delete an entry
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const entryId = parseInt(req.params.id);

    // Check if entry exists and belongs to user
    const existingEntry = await db.select()
      .from(journal_entries)
      .where(eq(journal_entries.id, entryId))
      .where(eq(journal_entries.user_id, req.user.userId));

    if (existingEntry.length === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await db.delete(journal_entries)
      .where(eq(journal_entries.id, entryId));

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ error: 'Server error deleting entry' });
  }
});

export default router; 