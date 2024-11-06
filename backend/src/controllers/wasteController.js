import { runMLModel } from '../utils/modelUtils.js';

export const detectWaste = async (req, res) => {
  const image = req.body.image; 

  try {
    const result = await runMLModel(image); 
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to detect waste', error });
  }
};
