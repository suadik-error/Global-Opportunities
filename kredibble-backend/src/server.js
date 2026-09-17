import { app } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase } from './lib/mongodb.js';

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(env.port, () => {
      console.log(`Kredibble API listening on http://localhost:${env.port}/api`);
    });
  } catch (error) {
    console.error('CRITICAL: Database connection failed on startup. Exiting...');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
