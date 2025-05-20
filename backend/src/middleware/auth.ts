import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token ? 'present' : 'missing');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    console.log('Verifying token with secret:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded);
    req.user = decoded as any;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
}; 