import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') next();
    else res.status(403).json({ message: 'Not authorized' });
  } catch (error) {
    res.status(403).json({ message: 'Failed to authenticate token' });
  }
};
