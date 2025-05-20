import { Request, Response } from 'express';
import { db } from '../db';
import { users, rvs, tow_vehicles } from '../schema';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        username: true,
        created_at: true
      }
    });
    res.json(result);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        username: true,
        created_at: true
      }
    });

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

export const userController = {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      console.log('Fetching profile for user ID:', userId);
      
      if (!userId) {
        console.log('No user ID found in request');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user data
      console.log('Fetching user data...');
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });

      if (!user) {
        console.log('User not found in database');
        return res.status(404).json({ error: 'User not found' });
      }
      console.log('User data found:', { id: user.id, email: user.email });

      // Get user's RVs
      console.log('Fetching user RVs...');
      const userRVs = await db.query.rvs.findMany({
        where: eq(rvs.user_id, userId),
        orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
      });
      console.log('Found RVs:', userRVs.length);

      // Get user's tow vehicles
      console.log('Fetching user tow vehicles...');
      const userTowVehicles = await db.query.tow_vehicles.findMany({
        where: eq(tow_vehicles.user_id, userId),
        orderBy: (tow_vehicles, { desc }) => [desc(tow_vehicles.is_current), desc(tow_vehicles.created_at)]
      });
      console.log('Found tow vehicles:', userTowVehicles.length);

      // Remove sensitive data and combine results
      const { password_hash, ...userData } = user;
      const profile = {
        ...userData,
        rvs: userRVs,
        tow_vehicles: userTowVehicles
      };

      console.log('Sending profile response');
      res.json(profile);
    } catch (error) {
      console.error('Error in getProfile:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      res.status(500).json({ 
        error: 'Server error fetching profile',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      });
    }
  },

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { display_name, bio } = req.body;

      const [updatedUser] = await db.update(users)
        .set({
          display_name,
          bio,
          updated_at: new Date()
        })
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          email: users.email,
          username: users.username,
          display_name: users.display_name,
          bio: users.bio,
          created_at: users.created_at
        });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get updated RVs
      const userRVs = await db.query.rvs.findMany({
        where: eq(rvs.user_id, userId),
        orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
      });

      res.json({
        ...updatedUser,
        rvs: userRVs
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Server error updating profile' });
    }
  }
}; 