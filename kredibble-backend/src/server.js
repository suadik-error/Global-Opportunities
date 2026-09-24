import { app } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase } from './lib/mongodb.js';

async function startServer() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully.');
  } catch (error) {
    console.warn('❌ Database connection failed:', error.message);

    // Only exit in production. In development, let the server run so the user can debug.
    const isProduction = process.env.NODE_ENV === 'production' || env.nodeEnv === 'production';
    if (isProduction) {
      console.error('CRITICAL: Database failure in production. Exiting...');
      process.exit(1);
    } else {
      console.warn('⚠️ Development mode: Continuing without database connection.');
    }
  }

  const server = app.listen(env.port, env.host, () => {
    console.log(`🚀 Kredibble API listening on http://localhost:${env.port}/api`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Stop the existing backend server and try again.`);
      process.exit(1);
    }

    throw error;
  });
}

startServer();
