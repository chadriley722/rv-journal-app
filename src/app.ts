import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { users, journal_entries } from './schema';
import { eq } from 'drizzle-orm';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import journalRoutes from './routes/journal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

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

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 