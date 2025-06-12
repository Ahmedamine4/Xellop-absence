import express from 'express';
import { createLeaveRequest, getLeaveRequestsByUser } from '../controllers/congeController.js';

const router = express.Router();

router.post('/', createLeaveRequest);
router.get('/:userId', getLeaveRequestsByUser);

export default router;





