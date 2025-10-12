import express from 'express';
import { 
  getNGOAlerts, 
  markAlertAsRead, 
  markAllAlertsAsRead, 
  deleteAlert 
} from '../controllers/alertController';

const router = express.Router();

router.get('/ngo/:ngoId', getNGOAlerts);
router.put('/:alertId/read', markAlertAsRead);
router.put('/ngo/:ngoId/read-all', markAllAlertsAsRead);
router.delete('/:alertId', deleteAlert);

export default router;
