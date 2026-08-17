import { Router } from 'express';
import { askQuestion, getHistory } from '../controllers/tutorController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/ask', protect, askQuestion);
router.get('/history', protect, getHistory);

export default router;