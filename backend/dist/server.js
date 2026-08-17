"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    // เชื่อมต่อ Database ก่อนเริ่มรัน Server
    await (0, database_1.connectDB)();
    app_1.default.listen(PORT, () => {
        console.log(`[Server] Server is running on http://localhost:${PORT}`);
        console.log(`[Server] Health check endpoint: http://localhost:${PORT}/api/health`);
    });
};
startServer();
