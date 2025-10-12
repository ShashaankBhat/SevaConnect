import express from 'express';
import { registerNGO, registerDonor, login } from '../controllers/authController';

const router = express.Router();

router.post('/ngo-register', registerNGO);
router.post('/donor-register', registerDonor);
router.post('/login', login);

export default router;
