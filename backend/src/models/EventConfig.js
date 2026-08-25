import mongoose from 'mongoose';

const eventConfigSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'HackSeries 2026',
    },
    eventTagline: {
      type: String,
      default: 'India’s Ultimate 48-Hour Hackathon & Innovation Arena',
    },
    eventDate: {
      type: String,
      default: 'October 16 - 18, 2026',
    },
    eventTime: {
      type: String,
      default: '09:00 AM IST (Check-in starts 07:30 AM)',
    },
    eventVenue: {
      type: String,
      default: 'Apex Tech Hub & Innovation Arena, Pune / Hybrid',
    },
    organizerEmail: {
      type: String,
      default: 'aditya.renake@outlook.com',
    },
    organizerName: {
      type: String,
      default: 'Aditya Renake (HackSeries Operations Lead)',
    },
    googleFormUrl: {
      type: String,
      default: 'https://forms.gle/U24ip7E6NqtbZkiT9',
    },
    emailSubjectTemplate: {
      type: String,
      default: '🎟️ Your Official Entry Pass for HackSeries 2026 — {{name}}',
    },
    emailBodyNotice: {
      type: String,
      default: 'Please present this digital pass with QR code at the registration desk for express check-in and hacker kit collection.',
    },
  },
  {
    timestamps: true,
  }
);

export const EventConfig = mongoose.model('EventConfig', eventConfigSchema);
