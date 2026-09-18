import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { ApiError } from './utils/http.js';

export const app = express();

const localDevOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (env.corsOrigins.includes(origin)) return true;
  if (env.isDevelopment && localDevOriginPattern.test(origin)) return true;
  // Allow all Vercel and Render subdomains in production for easier deployment
  if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) return true;
  return false;
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new ApiError(403, 'Origin is not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.use((err, req, res, next) => {
  if (err.code === 'P2025') {
    res.status(404).json({ error: { message: 'Resource not found' } });
    return;
  }

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: env.isDevelopment ? err.message : (status === 500 ? 'Internal server error' : err.message),
      stack: env.isDevelopment ? err.stack : undefined,
    },
  });
});
