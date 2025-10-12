import express from 'express';
import { getAllNGOs, getNGOById, updateNGO, addNgoNeed } from '../controllers/ngoController';

const router = express.Router();

router.get('/', getAllNGOs);
router.get('/:ngoId', getNGOById);
router.put('/:ngoId', updateNGO);
router.post('/:ngoId/needs', addNgoNeed);

export default router;
