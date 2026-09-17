import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (value) =>
  value
    ? value.split(',').map((origin) => origin.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006'];

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') !== 'production',
  port: Number(process.env.PORT || 4000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  jwtSecret: process.env.JWT_SECRET || 'replace-with-a-long-random-secret',
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || 'replace-with-a-long-random-admin-secret',
};

if (!env.isDevelopment) {
  const secrets = ['jwtSecret', 'adminJwtSecret'];
  for (const key of secrets) {
    if (env[key].includes('replace-with') || env[key].includes('placeholder')) {
      throw new Error(`CRITICAL SECURITY ERROR: ${key} is using a placeholder value in production!`);
    }
  }
}
