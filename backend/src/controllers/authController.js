import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminUser = {
  username: 'admin',
  password: '$2a$10$hashedpassword', // Hashed password
  role: 'admin',
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser.username) {
    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (isMatch) {
      const token = jwt.sign({ username: adminUser.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token });
    }
  }
  return res.status(401).json({ message: 'Invalid credentials' });
};
