import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // เชื่อมต่อ Database ก่อนเริ่มรัน Server
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Server is running on http://localhost:${PORT}`);
    console.log(`[Server] Health check endpoint: http://localhost:${PORT}/api/health`);
  });
};

startServer();