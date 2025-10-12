import express from 'express';
import { getPendingNGOs, verifyNGO, rejectNGO, getDashboardStats } from '../controllers/adminController';

const router = express.Router();

router.get('/ngos/pending', getPendingNGOs);
router.put('/ngos/:ngoId/verify', verifyNGO);
router.put('/ngos/:ngoId/reject', rejectNGO);
router.get('/dashboard/stats', getDashboardStats);

export default router;
