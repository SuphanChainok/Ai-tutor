"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tutorController_1 = require("../controllers/tutorController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// ล็อกให้เฉพาะผู้ที่ Login แล้ว (มี JWT Token) เท่านั้นที่ใช้งานได้
router.post('/ask', authMiddleware_1.protect, tutorController_1.askQuestion);
exports.default = router;
