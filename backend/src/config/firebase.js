import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance = null;
let isInMemoryFallback = false;

// In-Memory store for local development fallback if Google Cloud credentials are not yet set
class MemoryFirestore {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    const store = this.collections.get(name);

    return {
      doc: (id) => ({
        set: async (data, options = {}) => {
          const current = store.get(id) || {};
          const merged = options.merge ? { ...current, ...data } : { ...data };
          store.set(id, merged);
          return { writeTime: new Date() };
        },
        get: async () => ({
          exists: store.has(id),
          id,
          data: () => store.get(id) || null,
        }),
        update: async (data) => {
          if (!store.has(id)) throw new Error(`Document ${id} not found`);
          const current = store.get(id);
          const updated = { ...current, ...data };
          store.set(id, updated);
          return { writeTime: new Date() };
        },
        delete: async () => {
          store.delete(id);
          return { writeTime: new Date() };
        },
      }),
      where: (field, op, value) => ({
        limit: (limitCount) => ({
          get: async () => {
            const matches = [];
            for (const [id, item] of store.entries()) {
              if (op === '==' && item[field] === value) {
                matches.push({ id, exists: true, data: () => item });
                if (matches.length >= limitCount) break;
              }
            }
            return {
              empty: matches.length === 0,
              size: matches.length,
              docs: matches,
            };
          },
        }),
        get: async () => {
          const matches = [];
          for (const [id, item] of store.entries()) {
            if (op === '==' && item[field] === value) {
              matches.push({ id, exists: true, data: () => item });
            }
          }
          return {
            empty: matches.length === 0,
            size: matches.length,
            docs: matches,
          };
        },
      }),
      get: async () => {
        const docs = [];
        for (const [id, item] of store.entries()) {
          docs.push({ id, exists: true, data: () => item });
        }
        return {
          empty: docs.length === 0,
          size: docs.length,
          docs,
        };
      },
    };
  }
}

/**
 * Initialize Firebase Admin SDK
 */
export const initFirebase = () => {
  if (dbInstance) return dbInstance;

  try {
    if (admin.apps.length > 0) {
      dbInstance = admin.firestore();
      return dbInstance;
    }

    // 1. Check for Service Account JSON string in environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Connected to Google Cloud Firestore (via FIREBASE_SERVICE_ACCOUNT).');
      dbInstance = admin.firestore();
      return dbInstance;
    }

    // 2. Check for individual Project ID, Client Email & Private Key
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log(`✅ Connected to Google Cloud Firestore (${process.env.FIREBASE_PROJECT_ID}).`);
      dbInstance = admin.firestore();
      return dbInstance;
    }

    // 3. Check for Google Application Default Credentials
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log('✅ Connected to Google Cloud Firestore (via GOOGLE_APPLICATION_CREDENTIALS).');
      dbInstance = admin.firestore();
      return dbInstance;
    }

    // 4. Fallback for Local Dev
    console.log('⚡ [Firestore] No Google Cloud credentials configured yet. Running in local memory mode for development...');
    isInMemoryFallback = true;
    dbInstance = new MemoryFirestore();
    return dbInstance;
  } catch (err) {
    console.warn('⚠️ [Firestore] Connection notice, using local memory mode:', err.message);
    isInMemoryFallback = true;
    dbInstance = new MemoryFirestore();
    return dbInstance;
  }
};

export const getFirestore = () => {
  if (!dbInstance) {
    return initFirebase();
  }
  return dbInstance;
};
