import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import tutorRoutes from './routes/tutorRoutes';

const app: Application = appExpress();

function appExpress() {
  const instance = express();

  // Middleware
  instance.use(cors({ origin: '*' }));
  instance.use(express.json());

  // Health Check Endpoint
  instance.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      message: 'AI Tutor Backend API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  instance.use('/api/auth', authRoutes);
  instance.use('/api/tutor', tutorRoutes);

  return instance;
}

export default app;