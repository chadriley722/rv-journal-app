import { Request, Response } from 'express';
import { db } from '../db';
import { users, rvs } from '../schema';
import { eq } from 'drizzle-orm';

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
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          email: true,
          username: true,
          display_name: true,
          bio: true,
          created_at: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user's RVs
      const userRVs = await db.query.rvs.findMany({
        where: eq(rvs.user_id, userId),
        orderBy: (rvs, { desc }) => [desc(rvs.is_current), desc(rvs.created_at)]
      });

      res.json({
        ...user,
        rvs: userRVs
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Server error fetching profile' });
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