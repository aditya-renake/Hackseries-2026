import mongoose from 'mongoose';

const eventConfigSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'HackSeries 2026',
    },
    eventTagline: {
      type: String,
      default: 'Presented by ACES — Dept. of Computer Engineering, Dr. D. Y. Patil Institute of Technology, Pimpri, Pune (DYPDPU)',
    },
    eventDate: {
      type: String,
      default: 'October 16 - 18, 2026',
    },
    eventTime: {
      type: String,
      default: '09:00 AM IST (Gate Check-in starts 07:30 AM)',
    },
    eventVenue: {
      type: String,
      default: 'Dr. D. Y. Patil Institute of Technology (DIT), Sant Tukaram Nagar, Pimpri, Pune - 411018',
    },
    organizerEmail: {
      type: String,
      default: 'aditya.renake@outlook.com',
    },
    organizerName: {
      type: String,
      default: 'ACES (Association of Computer Engineering Students), DIT Pune',
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
