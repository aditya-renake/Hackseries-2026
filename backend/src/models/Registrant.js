import mongoose from 'mongoose';

const registrantSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    ticketType: {
      type: String,
      enum: ['Hacker Pass', 'VIP Pass', 'Mentor / Judge', 'Speaker Pass', 'Team Lead Pass', 'General Attendee'],
      default: 'Hacker Pass',
      index: true,
    },
    teamName: {
      type: String,
      default: '',
    },
    track: {
      type: String,
      enum: ['AI & Agentic Systems', 'Web3 & Decentralized', 'Cybersecurity & Privacy', 'Fintech & Open Finance', 'Open Innovation'],
      default: 'AI & Agentic Systems',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    institution: {
      type: String,
      default: '',
    },
    formResponses: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Zero Forged QR Code Fields (HMAC-SHA256 digital signature)
    qrPayload: {
      type: String,
      required: true,
    },
    qrSignature: {
      type: String,
      required: true,
    },
    qrCodeDataUrl: {
      type: String,
      required: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
    emailSendCount: {
      type: Number,
      default: 0,
    },
    checkedIn: {
      type: Boolean,
      default: false,
      index: true,
    },
    checkedInAt: {
      type: Date,
      default: null,
      index: true,
    },
    checkedInBy: {
      type: String,
      default: null,
    },
    checkinNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// High scale compound indexes for sub-10ms queries over 2000+ attendees
registrantSchema.index({ checkedIn: 1, emailSent: 1 });
registrantSchema.index({ email: 1, uniqueId: 1 });
registrantSchema.index({ name: 'text', email: 'text', phone: 'text', teamName: 'text' });

export const Registrant = mongoose.model('Registrant', registrantSchema);
