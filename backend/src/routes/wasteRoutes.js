import express from 'express';
import { detectWaste } from '../controllers/wasteController.js';

const router = express.Router();

router.post('/upload', detectWaste); // Public route for uploading image

export default router;
