import { runMLModel } from '../utils/modelUtils.js';

export const detectWaste = async (req, res) => {
  const image = req.body.image; // Assuming the image is sent in the request body

  try {
    const result = await runMLModel(image); // Run model to detect waste
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to detect waste', error });
  }
};
