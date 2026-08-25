import jwt from 'jsonwebtoken';
import { StaffUser } from '../models/StaffUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hackseries_2026_jwt_super_secret_key_8899';

export const login = async (req, res) => {
  try {
    const { username, email, identifier, password } = req.body;
    const rawIdentifier = (username || email || identifier || '').toLowerCase().trim();

    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and password are required.' });
    }

    const user = await StaffUser.findOne({
      $or: [
        { username: rawIdentifier },
        { email: rawIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
