import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Admin login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Find user and select password
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Logout (client-side, just invalidate token)
 */
export const logout = asyncHandler(async (req, res) => {
  // Token invalidation is handled client-side (remove from storage)
  res.json({ message: 'Logged out successfully' });
});

/**
 * Refresh token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

/**
 * Create initial admin user (run once during setup)
 */
export const createAdminUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return res.status(409).json({ message: 'Admin user already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const admin = await User.create({
    email,
    passwordHash: hashedPassword,
    role: 'admin',
  });

  res.status(201).json({
    message: 'Admin user created successfully',
    user: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
});
