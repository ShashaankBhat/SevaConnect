import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import NGO from '../models/NGO';

export const addInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId, itemName, category, quantity, currentStock, urgency, expiryDate, description, targetQuantity } = req.body;

    // Verify NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      res.status(400).json({ error: 'NGO not found' });
      return;
    }

    // Create inventory item
    const inventoryItem = new Inventory({
      ngoId,
      itemName,
      category,
      quantity,
      currentStock: currentStock || quantity,
      urgency,
      expiryDate,
      description,
      targetQuantity
    });

    await inventoryItem.save();

    res.status(201).json({
      message: 'Inventory item added successfully',
      inventoryItem
    });
  } catch (error) {
    console.error('Add inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNGOInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;

    const inventory = await Inventory.find({ ngoId }).sort({ urgency: -1, createdAt: -1 });

    res.json({
      inventory
    });
  } catch (error) {
    console.error('Get NGO inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    const inventoryItem = await Inventory.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true }
    );

    if (!inventoryItem) {
      res.status(404).json({ error: 'Inventory item not found' });
      return;
    }

    res.json({
      message: 'Inventory item updated successfully',
      inventoryItem
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const inventoryItem = await Inventory.findByIdAndDelete(itemId);

    if (!inventoryItem) {
      res.status(404).json({ error: 'Inventory item not found' });
      return;
    }

    res.json({
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLowStockItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;
    
    const lowStockItems = await Inventory.find({ 
      ngoId, 
      currentStock: { $lt: 5 } 
    }).sort({ currentStock: 1 });

    res.json({
      lowStockItems
    });
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
