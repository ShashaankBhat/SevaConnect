import express from 'express';
import { searchNGOs, getSearchFilters } from '../controllers/searchController';

const router = express.Router();

router.get('/ngos', searchNGOs);
router.get('/filters', getSearchFilters);

export default router;
