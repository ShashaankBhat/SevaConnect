import { Request, Response } from 'express';
import Alert from '../models/Alert';

export const getNGOAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;
    const alerts = await Alert.find({ ngoId }).sort({ createdAt: -1 });
    const unreadCount = await Alert.countDocuments({ ngoId, isRead: false });
    res.json({ alerts, unreadCount });
  } catch (error) {
    console.error('Get NGO alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAlertAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndUpdate(alertId, { isRead: true }, { new: true });
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }
    res.json({ message: 'Alert marked as read', alert });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAllAlertsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;
    await Alert.updateMany({ ngoId, isRead: false }, { isRead: true });
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    console.error('Mark all alerts as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndDelete(alertId);
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAlert = async (
  ngoId: string, 
  type: 'low-stock' | 'expiry' | 'new-donation' | 'volunteer-request' | 'system',
  message: string,
  priority: 'high' | 'medium' | 'low' = 'medium',
  relatedEntity?: { type: 'donation' | 'inventory' | 'volunteer'; id: string }
): Promise<void> => {
  try {
    const alert = new Alert({ ngoId, type, message, priority, relatedEntity });
    await alert.save();
  } catch (error) {
    console.error('Create alert error:', error);
  }
};
