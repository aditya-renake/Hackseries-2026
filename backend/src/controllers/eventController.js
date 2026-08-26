import { configRepo } from '../models/configRepo.js';

export const getEventConfig = async (req, res) => {
  try {
    const config = await configRepo.getConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event configuration', error: error.message });
  }
};

export const updateEventConfig = async (req, res) => {
  try {
    const updated = await configRepo.updateConfig(req.body);
    res.json({ success: true, message: 'Event configuration updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event configuration', error: error.message });
  }
};
