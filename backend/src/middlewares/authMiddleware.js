// import jwt from 'jsonwebtoken';

// export const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(403).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role === 'admin') next();
//     else res.status(403).json({ message: 'Not authorized' });
//   } catch (error) {
//     res.status(403).json({ message: 'Failed to authenticate token' });
//   }
// };

// middleware/authMiddleware.js
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
};

const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
  }
  res.status(403).send('Access Denied');
};

const ensureUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'user') {
      return next();
  }
  res.status(403).send('Access Denied');
};

module.exports = { ensureAuthenticated, ensureAdmin, ensureUser };

