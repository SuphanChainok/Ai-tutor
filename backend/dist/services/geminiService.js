"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askGeminiTutor = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const askGeminiTutor = async (prompt, topic) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is missing in environment variables');
        }
        const systemInstruction = `
คุณคือ "AI Tutor" ติวเตอร์ส่วนตัวที่ใจดี เป็นกันเอง และเชี่ยวชาญด้านการสอน
- ตอบคำถามด้วยภาษาไทยที่เข้าใจง่าย กระชับ และเป็นขั้นตอน
- หากผู้เรียนถามเกี่ยวกับหัวข้อเฉพาะ เช่น ${topic || 'ทั่วไป'} ให้เน้นยกตัวอย่างที่เกี่ยวข้องกับหัวข้อนั้น
    `.trim();
        // เรียกใช้ Gemini REST API โดยตรงผ่าน fetch (v1beta API)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `${systemInstruction}\n\nคำถาม: ${prompt}` }],
                    },
                ],
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('[Gemini API Error Response]:', data);
            throw new Error(data.error?.message || 'Failed to fetch from Gemini API');
        }
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply)
            return reply;
        throw new Error('No candidates returned from Gemini API');
    }
    catch (error) {
        console.error('[Gemini Service Error]:', error);
        console.warn('[Gemini Service] Falling back to mock response...');
        return [
            `ขอบคุณสำหรับคำถาม: "${prompt}"`,
            '',
            'ตอนนี้ยังไม่สามารถเชื่อมต่อกับ Gemini AI ได้ (API key ไม่ถูกต้อง หรือมีปัญหา)',
            'นี่คือคำตอบจำลอง (mock) เพื่อให้ระบบสามารถทดสอบได้ก่อน',
            `หัวข้อ: ${topic || 'ทั่วไป'}`,
            '',
            'เมื่อใส่ GEMINI_API_KEY ที่ถูกต้อง (ขึ้นต้นด้วย AIza...) แล้ว ระบบจะตอบจริงโดยอัตโนมัติ',
        ].join('\n');
    }
};
exports.askGeminiTutor = askGeminiTutor;
