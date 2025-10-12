import express from 'express';
import { 
  applyAsVolunteer, 
  getDonorVolunteerApplications, 
  getNGOVolunteerApplications, 
  updateVolunteerStatus 
} from '../controllers/volunteerController';

const router = express.Router();

router.post('/apply', applyAsVolunteer);
router.get('/donor/:donorId', getDonorVolunteerApplications);
router.get('/ngo/:ngoId', getNGOVolunteerApplications);
router.put('/:applicationId/status', updateVolunteerStatus);

export default router;
