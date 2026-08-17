import dotenv from 'dotenv';

dotenv.config();

export const askGeminiTutor = async (
  prompt: string,
  topic?: string
): Promise<string> => {
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

    // ใช้ gemini-3.6-flash (ล่าสุด)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

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
    return reply || 'ขออภัย ไม่สามารถสร้างคำตอบได้ในขณะนี้';
  } catch (error: any) {
    console.error('[Gemini Service Error]:', error);
    throw new Error(error.message || 'Failed to get response from Gemini AI');
  }
};