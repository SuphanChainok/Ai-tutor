"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = void 0;
const geminiService_1 = require("../services/geminiService");
// @desc    Ask a question to AI Tutor
// @route   POST /api/tutor/ask
// @access  Private
const askQuestion = async (req, res) => {
    try {
        const { prompt, topic } = req.body;
        if (!prompt) {
            res.status(400).json({
                success: false,
                message: 'Please provide a prompt/question',
            });
            return;
        }
        const answer = await (0, geminiService_1.askGeminiTutor)(prompt, topic);
        res.status(200).json({
            success: true,
            data: {
                question: prompt,
                topic: topic || 'General',
                answer,
                user: {
                    id: req.user?._id,
                    name: req.user?.name,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error communicating with AI Tutor',
        });
    }
};
exports.askQuestion = askQuestion;
