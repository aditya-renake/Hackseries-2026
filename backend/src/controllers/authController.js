import jwt from 'jsonwebtoken';
import { staffRepo } from '../models/staffRepo.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hackseries_2026_jwt_super_secret_key_8899';

export const login = async (req, res) => {
  try {
    const { username, email, identifier, password } = req.body;
    const rawIdentifier = (username || email || identifier || '').toLowerCase().trim();

    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and password are required.' });
    }

    let user = await staffRepo.findByIdentifier(rawIdentifier);

    if (!user && (rawIdentifier === 'adityarenake' || rawIdentifier === 'tigeradi1504@gmail.com' || rawIdentifier === 'aditya.renake@outlook.com')) {
      await staffRepo.seedDefaultAdmin();
      user = await staffRepo.findByIdentifier(rawIdentifier);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await staffRepo.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    await staffRepo.updateLastLogin(user.username);

    const token = jwt.sign(
      {
        userId: user.username,
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
        id: user.username,
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
