import express from 'express';
import { getNotifications } from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/notifications', verifyToken, getNotifications);

export default router;
