import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js';
import pickupRoutes from './src/routes/pickups.js';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
let io = null;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/uploads', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file, please try again later.' });
  }
});

// Auth routes
console.log('Mounting auth routes at /api/auth');
app.use('/api/auth', authRoutes);
console.log('Auth routes mounted successfully');

// Pickups routes
app.use('/api/pickups', pickupRoutes);

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running and responding' });
});

// Connect to MongoDB then start server
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI not set. Please add it to your .env file.');
} else {
  mongoose
    .connect(mongoUri, { 
      dbName: process.env.MONGO_DB_NAME || undefined,
    })
    .then(() => {
      console.log('Connected to MongoDB');
      const server = app.listen(port, () => {
        console.log(`Node.js server running on port ${port}`);
      });
      // Socket.IO setup
      io = new Server(server, { cors: { origin: '*' } });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

  