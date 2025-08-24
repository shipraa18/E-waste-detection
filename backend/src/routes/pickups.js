import express from 'express';
import Pickup from '../models/Pickup.js';
import { requireAuth, requireAdmin } from '../middlewares/jwtAuth.js';

const router = express.Router();

// Create pickup (user)
router.post('/', requireAuth, async (req, res) => {
  try {
    // Only regular users can create pickups
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can schedule pickups' });
    }
    const { center, date, time, address, wasteType, instructions, imageFilename } = req.body;
    if (!center?.name || !date || !time || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const pickup = await Pickup.create({
      user: { id: req.user.id, username: req.user.username },
      center,
      date,
      time,
      address,
      wasteType,
      instructions,
      imageFilename,
    });
    return res.status(201).json(pickup);
  } catch (err) {
    console.error('Create pickup error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List pickups (admin)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, centerId, from, to } = req.query;
    const query = {};
    if (status) query.status = status;
    if (centerId) query['center.id'] = centerId;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const pickups = await Pickup.find(query).sort({ createdAt: -1 }).lean();
    return res.json(pickups);
  } catch (err) {
    console.error('List pickups error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List my pickups (user)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== 'user') return res.status(403).json({ message: 'User only' });
    const pickups = await Pickup.find({ 'user.id': req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json(pickups);
  } catch (err) {
    console.error('List my pickups error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update status (admin)
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const update = { status };
    if (status === 'completed') {
      update.completedAt = new Date();
      // optional immediate archive
      if (process.env.PICKUP_ARCHIVE_ON_COMPLETE === '1') update.archivedAt = new Date();
    }
    const updated = await Pickup.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Update status error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Summary by center (admin)
router.get('/summary/by-center', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const summary = await Pickup.aggregate([
      {
        $group: {
          _id: '$center.name',
          center: { $first: '$center' },
          total: { $sum: 1 },
          scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
          in_progress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ]);
    return res.json(summary);
  } catch (err) {
    console.error('Summary by center error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


