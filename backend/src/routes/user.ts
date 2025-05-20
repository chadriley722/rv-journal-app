import express from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { db } from '../db';
import { users } from '../schema';
import { sql } from 'drizzle-orm';

const router = express.Router();

// Test endpoint to check database state
router.get('/test', async (req, res) => {
  try {
    // Get all users
    const allUsers = await db.query.users.findMany();
    console.log('All users in database:', allUsers);
    
    // Get table info
    const tableInfo = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Available tables:', tableInfo);

    res.json({
      userCount: allUsers.length,
      users: allUsers,
      tables: tableInfo
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/me', userController.getProfile);

// Update user profile
router.patch('/me', userController.updateProfile);

export default router; 