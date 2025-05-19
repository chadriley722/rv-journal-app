import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { users, journal_entries } from './schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('RV Journal API is running');
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// GET user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error fetching user' });
  }
});

// POST create a new user
app.post('/users', async (req: Request, res: Response) => {
  const { username, email, password_hash } = req.body;

  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newUser = await db.insert(users).values({
      username,
      email,
      password_hash,
    }).returning();
    
    res.status(201).json(newUser[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error creating user' });
  }
});

// POST a new journal entry
app.post('/entries', async (req: Request, res: Response) => {
  const { user_id, entry_text } = req.body;

  if (!user_id || !entry_text) {
    return res.status(400).json({ error: 'user_id and entry_text are required' });
  }

  try {
    const newEntry = await db.insert(journal_entries).values({
      user_id,
      entry_text,
    }).returning();

    res.status(201).json(newEntry[0]);
  } catch (err) {
    console.error('Error creating journal entry:', err);
    res.status(500).json({ error: 'Server error creating entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 