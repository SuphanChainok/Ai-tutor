import { Request, Response } from 'express';
import { askGeminiTutor } from '../services/geminiService';
import ChatHistory from '../models/ChatHistory';

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { prompt, topic } = req.body;
    const userId = (req as any).user?.id; // ดึง id จาก Auth Middleware

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const answer = await askGeminiTutor(prompt, topic);

    // บันทึกลง MongoDB
    if (userId) {
      await ChatHistory.create({
        userId,
        question: prompt,
        answer,
        topic: topic || 'General',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        question: prompt,
        topic,
        answer,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ดึงประวัติการคุยทั้งหมดของผู้ใช้ที่ล็อกอินอยู่
export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const history = await ChatHistory.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};