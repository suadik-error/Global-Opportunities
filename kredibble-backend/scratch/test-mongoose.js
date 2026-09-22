import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DATABASE_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
const maskMongoUri = (value) => value.replace(/(mongodb(?:\+srv)?:\/\/[^:\s]+:)[^@\s]+@/i, '$1***@');

async function test() {
  if (!uri) {
    console.error('Missing MongoDB connection string. Set DATABASE_URL, MONGODB_URI, or MONGO_URI.');
    process.exit(1);
  }

  console.log('Testing Mongoose connection to:', maskMongoUri(uri));
  try {
    await mongoose.connect(uri, {
      dbName: 'kredibble',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('CONNECTED successfully!');
    process.exit(0);
  } catch (err) {
    console.error('CONNECTION FAILED:');
    console.error(err.message);
    process.exit(1);
  }
}

test();
