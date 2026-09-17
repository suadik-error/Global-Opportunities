import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

let db;
let lastError = null;

export async function connectToDatabase() {
  if (db) return db;

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas (Native)');
    db = client.db();
    lastError = null;
    return db;
  } catch (err) {
    lastError = err.message;
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

export const getDb = () => {
  if (!db) {
    throw new Error(`Database not initialized. Last error: ${lastError || 'None'}. Check your Atlas IP whitelist and network connection.`);
  }
  return db;
};

// Helper for collections
export const collections = {
  users: () => getDb().collection('users'),
  seekers: () => getDb().collection('seekers'),
  hirers: () => getDb().collection('hirers'),
  opportunities: () => getDb().collection('opportunities'),
  applicants: () => getDb().collection('applicants'),
  candidates: () => getDb().collection('candidates'),
  channels: () => getDb().collection('channels'),
  posts: () => getDb().collection('posts'),
  reports: () => getDb().collection('reports'),
  events: () => getDb().collection('events'),
  grants: () => getDb().collection('grants'),
  articles: () => getDb().collection('articles'),
  staff: () => getDb().collection('staff'),
  notifications: () => getDb().collection('notifications'),
  verifications: () => getDb().collection('verifications'),
  grantApplications: () => getDb().collection('grantApplications'),
};
