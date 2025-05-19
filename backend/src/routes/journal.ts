import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { db } from '../db';
import { journal_entries } from '../schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all journal entries
router.get('/', authenticateToken, async (req, res) => {
  try {
    const entries = await db.query.journal_entries.findMany({
      where: eq(journal_entries.user_id, req.user!.id),
      orderBy: (entries, { desc }) => [desc(entries.created_at)]
    });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new journal entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, location } = req.body;
    
    const [newEntry] = await db.insert(journal_entries).values({
      user_id: req.user!.id,
      title,
      content,
      location
    }).returning();

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get a specific journal entry
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await db.query.journal_entries.findFirst({
      where: (entries, { and, eq }) => and(
        eq(entries.id, parseInt(req.params.id)),
        eq(entries.user_id, req.user!.id)
      )
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a journal entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, location } = req.body;
    
    const [updatedEntry] = await db.update(journal_entries)
      .set({
        title,
        content,
        location,
        updated_at: new Date()
      })
      .where((entries, { and, eq }) => and(
        eq(entries.id, parseInt(req.params.id)),
        eq(entries.user_id, req.user!.id)
      ))
      .returning();

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Delete a journal entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [deletedEntry] = await db.delete(journal_entries)
      .where((entries, { and, eq }) => and(
        eq(entries.id, parseInt(req.params.id)),
        eq(entries.user_id, req.user!.id)
      ))
      .returning();

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 