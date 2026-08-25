import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConnection = null;
let mongodInstance = null;

export const connectDB = async () => {
  // If already connected in serverless container, reuse
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('🔄 Connecting to MongoDB Atlas/Cluster...');
      cachedConnection = await mongoose.connect(mongoUri, {
        bufferCommands: false,
      });
      console.log('✅ Connected to MongoDB Atlas successfully.');
    } else {
      console.log('⚡ Initializing in-memory MongoDB engine...');
      if (!mongodInstance) {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
      }
      const inMemoryUri = mongodInstance.getUri();
      cachedConnection = await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB running at: ${inMemoryUri}`);
    }

    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};
