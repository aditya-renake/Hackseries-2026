import jwt from 'jsonwebtoken';
import { staffRepo } from '../models/staffRepo.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hackseries_2026_jwt_super_secret_key_8899';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await staffRepo.findByIdentifier(decoded.userId || decoded.username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
    }

    const { passwordHash, ...userSafe } = user;
    req.user = userSafe;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Administrator privileges required.' });
  }
  next();
};
