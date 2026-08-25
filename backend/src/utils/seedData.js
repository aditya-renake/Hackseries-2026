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

      const adminPasswordHash = await bcrypt.hash('hackseries2026', 10);
      const standardAdminHash = await bcrypt.hash('admin123', 10);
      const scannerPasswordHash = await bcrypt.hash('scanner123', 10);

      await StaffUser.create([
        {
          name: 'Aditya Renake',
          email: 'aditya.renake@outlook.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
        },
        {
          name: 'HackSeries Operations Admin',
          email: 'admin@hackseries.io',
          passwordHash: standardAdminHash,
          role: 'admin',
        },
        {
          name: 'Gate Scanner #1',
          email: 'gate1@hackseries.io',
          passwordHash: scannerPasswordHash,
          role: 'scanner',
        },
      ]);

      console.log('✅ Staff users created.');
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

    const regCount = await Registrant.countDocuments();
    if (regCount === 0) {
      console.log('🌱 Seeding initial Google Form submissions for HackSeries 2026...');

      const sampleAttendees = [
        {
          name: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+91 98765 43210',
          ticketType: 'Team Lead Pass',
          teamName: 'CyberNova',
          track: 'Cybersecurity & Privacy',
          institution: 'COEP Technological University',
          githubUrl: 'https://github.com/aaravsharma',
          formResponses: {
            'T-Shirt Size': 'L',
            'Dietary Preference': 'Vegetarian',
            'Years of Coding Experience': '3-5 years',
            'Hackathon Project Idea': 'Decentralized Zero-Knowledge Identity Verification for Web3 Passports',
          },
          checkedIn: false,
          emailSent: true,
        },
        {
          name: 'Pooja Iyer',
          email: 'pooja.iyer@example.com',
          phone: '+91 98220 11223',
          ticketType: 'Hacker Pass',
          teamName: 'NeuralAgents',
          track: 'AI & Agentic Systems',
          institution: 'IIT Bombay',
          githubUrl: 'https://github.com/poojaiyer',
          formResponses: {
            'T-Shirt Size': 'M',
            'Dietary Preference': 'Non-Vegetarian',
            'Years of Coding Experience': '2-3 years',
            'Hackathon Project Idea': 'Autonomous Multi-Agent DevOps Incident Remediation Mesh',
          },
          checkedIn: true,
          checkedInAt: new Date(Date.now() - 45 * 60 * 1000),
          checkedInBy: 'Aditya Renake',
          emailSent: true,
        },
        {
          name: 'Rohan Deshmukh',
          email: 'rohan.deshmukh@example.com',
          phone: '+91 99334 55667',
          ticketType: 'Hacker Pass',
          teamName: 'DeFiForge',
          track: 'Web3 & Decentralized',
          institution: 'PICT Pune',
          githubUrl: 'https://github.com/rohandesh',
          formResponses: {
            'T-Shirt Size': 'XL',
            'Dietary Preference': 'Vegetarian',
            'Years of Coding Experience': '3+ years',
            'Hackathon Project Idea': 'Cross-chain Automated Liquidity Balancer with Flash Loan Guards',
          },
          checkedIn: false,
          emailSent: false,
        },
        {
          name: 'Dr. Vikram Malhotra',
          email: 'vikram.malhotra@techcorp.io',
          phone: '+91 91234 56789',
          ticketType: 'Mentor / Judge',
          teamName: '',
          track: 'AI & Agentic Systems',
          institution: 'AI Research Director, Vertex Labs',
          githubUrl: '',
          formResponses: {
            'Expertise Area': 'Large Foundation Models & Reinforcement Learning',
            'Available for Mentoring': 'Both Days (Saturday & Sunday)',
          },
          checkedIn: false,
          emailSent: true,
        },
        {
          name: 'Ananya Roy',
          email: 'ananya.roy@example.com',
          phone: '+91 97788 99001',
          ticketType: 'Hacker Pass',
          teamName: 'FinNova',
          track: 'Fintech & Open Finance',
          institution: 'BITS Pilani',
          githubUrl: 'https://github.com/ananyaroy',
          formResponses: {
            'T-Shirt Size': 'S',
            'Dietary Preference': 'Vegetarian',
            'Years of Coding Experience': '1-2 years',
            'Hackathon Project Idea': 'Voice-activated Micro-investment AI Assistant for Rural Communities',
          },
          checkedIn: false,
          emailSent: false,
        },
        {
          name: 'Karan Mehra',
          email: 'karan.mehra@example.com',
          phone: '+91 94567 89012',
          ticketType: 'VIP Pass',
          teamName: 'QuantumLeap',
          track: 'Open Innovation',
          institution: 'Tech Investor / Ecosystem Partner',
          formResponses: {
            'Organization': 'Matrix Venture Partners',
            'Session Interest': 'Demo Day & Investor Pitch Arena',
          },
          checkedIn: false,
          emailSent: true,
        },
      ];

      for (const item of sampleAttendees) {
        const rawUuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
        const uniqueId = `HS26-${rawUuid}`;
        const signature = generatePassSignature(uniqueId, item.email, item.ticketType);
        const qrPayload = createQRPayload(uniqueId, item.email, item.ticketType);
        const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

        await Registrant.create({
          ...item,
          uniqueId,
          qrPayload,
          qrSignature: signature,
          qrCodeDataUrl,
          emailSentAt: item.emailSent ? new Date(Date.now() - 2 * 3600 * 1000) : null,
          emailSendCount: item.emailSent ? 1 : 0,
        });
      }

      console.log(`✅ Seeded ${sampleAttendees.length} sample attendees from Google Form intake.`);
    }
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
};
