import express from 'express';
import { 
  addInventoryItem, 
  getNGOInventory, 
  updateInventoryItem, 
  deleteInventoryItem,
  getLowStockItems 
} from '../controllers/inventoryController';

const router = express.Router();

router.post('/', addInventoryItem);
router.get('/ngo/:ngoId', getNGOInventory);
router.get('/ngo/:ngoId/low-stock', getLowStockItems);
router.put('/:itemId', updateInventoryItem);
router.delete('/:itemId', deleteInventoryItem);

export default router;
