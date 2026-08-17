import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getHealthStatus = (req: Request, res: Response): void => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'success',
    message: 'AI Tutor Backend API is running smoothly',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus
    }
  });
};