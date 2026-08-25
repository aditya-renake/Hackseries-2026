import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If already connected in Mongoose, return connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  let mongoUri = (process.env.MONGODB_URI || '').trim();

  // Auto-sanitize common connection string mistakes (quotes, <>, double slashes)
  if (mongoUri) {
    mongoUri = mongoUri.replace(/^["']|["']$/g, ''); // remove surrounding quotes
    mongoUri = mongoUri.replace(/<([^>]+)>/g, '$1'); // remove < > around password if present
    mongoUri = mongoUri.replace(/mongodb\.net\/\/+/g, 'mongodb.net/'); // fix double slash
  }

  if (mongoUri) {
    if (!cached.promise) {
      console.log('🔄 Connecting to MongoDB Atlas...');
      cached.promise = mongoose
        .connect(mongoUri, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        })
        .then((m) => {
          console.log('✅ Connected to MongoDB Atlas successfully.');
          return m;
        });
    }

    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      console.error('❌ MongoDB Atlas Connection Error:', error.message);
      throw error;
    }
  }

  // Fallback for local development when no MONGODB_URI is provided
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('⚡ Initializing in-memory MongoDB engine for local dev...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      cached.conn = await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB running at: ${inMemoryUri}`);
      return cached.conn;
    } catch (e) {
      console.error('In-memory MongoDB failed:', e.message);
      throw new Error(`Local DB failed and MONGODB_URI is not set: ${e.message}`);
    }
  }

  throw new Error('MONGODB_URI environment variable is missing on Vercel.');
};
