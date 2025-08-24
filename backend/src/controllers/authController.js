import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signJwtForUser = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET');
  return jwt.sign(
    { id: user._id.toString(), username: user.username, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  const { fullName, email, username, password, confirmPassword } = req.body;

  if (!fullName || !email || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ fullName, email, username, password, role: 'user' });
    await user.save();

    const token = signJwtForUser(user);
    return res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Error during registration', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const registerAdmin = async (req, res) => {
  const { fullName, email, username, password, confirmPassword, adminSecret } = req.body;
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid admin secret' });
  }
  req.body.confirmPassword = confirmPassword; // retained for consistency
  try {
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ fullName, email, username, password, role: 'admin' });
    await user.save();
    const token = signJwtForUser(user);
    return res.status(201).json({ message: 'Admin registered successfully', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Error during admin registration', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const query = username.includes('@')
      ? { email: username.toLowerCase() }
      : { $or: [{ username }, { email: username.toLowerCase() }] };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signJwtForUser(user);
    return res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
