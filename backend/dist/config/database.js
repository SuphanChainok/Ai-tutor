"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tutor';
        const conn = await mongoose_1.default.connect(connStr);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[Database Error] Failed to connect:`, error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
