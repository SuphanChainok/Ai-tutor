import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

// Connect to database on cold start
connectDB().catch(console.error);

export default app;
