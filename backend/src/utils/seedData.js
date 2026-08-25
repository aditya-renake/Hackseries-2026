import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { StaffUser } from '../models/StaffUser.js';
import { Registrant } from '../models/Registrant.js';
import { EventConfig } from '../models/EventConfig.js';
import { createQRPayload, generatePassSignature, generateQRCodeDataUrl } from '../services/qrService.js';

export const seedDatabase = async () => {
  try {
    const userCount = await StaffUser.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial staff and admin accounts for HackSeries 2026...');

      const adminPasswordHash = await bcrypt.hash('Aditya@11', 10);

      await StaffUser.create([
        {
          username: 'adityarenake',
          name: 'Aditya Renake',
          email: 'aditya.renake@outlook.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
        },
      ]);

      console.log('✅ Admin user adityarenake created.');
    }

    const configCount = await EventConfig.countDocuments();
    if (configCount === 0) {
      await EventConfig.create({
        eventName: 'HackSeries 2026',
        eventTagline: 'India’s Ultimate 48-Hour Hackathon & Innovation Arena',
        eventDate: 'October 16 - 18, 2026',
        eventTime: '09:00 AM IST (Gate Check-in starts 07:30 AM)',
        eventVenue: 'Apex Tech Hub & Innovation Arena, Pune / Hybrid',
        organizerEmail: 'aditya.renake@outlook.com',
        organizerName: 'Aditya Renake (HackSeries Operations Lead)',
        googleFormUrl: 'https://forms.gle/U24ip7E6NqtbZkiT9',
        emailSubjectTemplate: '🎟️ Your Official Entry Pass for HackSeries 2026 — {{name}}',
        emailBodyNotice: 'Please present this digital pass with QR code at the registration desk for express check-in and hacker kit collection.',
      });
      console.log('✅ Event configuration initialized.');
    }
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
};
