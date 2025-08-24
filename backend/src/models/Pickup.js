import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema(
  {
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      email: { type: String },
    },
    center: {
      id: { type: String },
      name: { type: String, required: true },
      address: { type: String },
      phone: { type: String },
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    wasteType: { type: String },
    instructions: { type: String },
    imageFilename: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    completedAt: { type: Date },
    archivedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

// TTL index for archived documents (auto-delete after 30 days)
// You can change the window via env PICKUP_TTL_DAYS
const ttlDays = parseInt(process.env.PICKUP_TTL_DAYS || '30', 10);
if (Number.isFinite(ttlDays) && ttlDays > 0) {
  pickupSchema.index({ archivedAt: 1 }, { expireAfterSeconds: ttlDays * 24 * 60 * 60 });
}

const Pickup = mongoose.model('Pickup', pickupSchema);
export default Pickup;


