"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getHealthStatus = (req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'success',
        message: 'AI Tutor Backend API is running smoothly',
        timestamp: new Date().toISOString(),
        services: {
            database: dbStatus
        }
    });
};
exports.getHealthStatus = getHealthStatus;
