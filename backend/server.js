import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './src/routes/adminRoutes.js';
import wasteRoutes from './src/routes/wasteRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/waste', wasteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
