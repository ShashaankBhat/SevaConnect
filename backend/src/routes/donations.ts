import express from 'express';
import { createDonation, getDonorDonations, getNGODonations, updateDonationStatus } from '../controllers/donationController';

const router = express.Router();

router.post('/', createDonation);
router.get('/donor/:donorId', getDonorDonations);
router.get('/ngo/:ngoId', getNGODonations);
router.put('/:donationId/status', updateDonationStatus);

export default router;
