import { EventConfig } from '../models/EventConfig.js';

export const getEventConfig = async (req, res) => {
  try {
    let config = await EventConfig.findOne();
    if (!config) {
      config = await EventConfig.create({
        eventName: 'HackSeries 2026',
        eventTagline: 'India’s Ultimate 48-Hour Hackathon & Innovation Arena',
        eventDate: 'October 16 - 18, 2026',
        eventTime: '09:00 AM IST (Check-in starts 07:30 AM)',
        eventVenue: 'Apex Tech Hub & Innovation Arena, Pune / Hybrid',
        organizerEmail: 'aditya.renake@outlook.com',
        organizerName: 'Aditya Renake (HackSeries Operations Lead)',
        googleFormUrl: 'https://forms.gle/U24ip7E6NqtbZkiT9',
        emailSubjectTemplate: '🎟️ Your Official Entry Pass for HackSeries 2026 — {{name}}',
        emailBodyNotice: 'Please present this digital pass with QR code at the registration desk for express check-in and hacker kit collection.',
      });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event configuration', error: error.message });
  }
};

export const updateEventConfig = async (req, res) => {
  try {
    let config = await EventConfig.findOne();
    if (!config) {
      config = new EventConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json({ success: true, message: 'Event configuration updated', data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event configuration', error: error.message });
  }
};
