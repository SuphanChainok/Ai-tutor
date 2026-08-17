"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tutorRoutes_1 = __importDefault(require("./routes/tutorRoutes"));
const app = appExpress();
function appExpress() {
    const instance = (0, express_1.default)();
    // Middleware
    instance.use((0, cors_1.default)());
    instance.use(express_1.default.json());
    // Health Check Endpoint
    instance.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            message: 'AI Tutor Backend API is running',
            timestamp: new Date().toISOString(),
        });
    });
    // API Routes
    instance.use('/api/auth', authRoutes_1.default);
    instance.use('/api/tutor', tutorRoutes_1.default);
    return instance;
}
exports.default = app;
