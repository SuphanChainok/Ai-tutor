import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

// Connect to database on cold start
connectDB().catch(console.error);

// เพิ่มส่วนนี้ลงไปเพื่อให้เปิด Port 5000 เมื่อรันบนเครื่อง Local
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
}

export default app;