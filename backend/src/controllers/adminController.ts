import { Request, Response } from 'express';
import NGO from '../models/NGO';
import User from '../models/User';
import Donation from '../models/Donation';

export const getPendingNGOs = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingNGOs = await NGO.find({ verificationStatus: 'pending' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      ngos: pendingNGOs
    });
  } catch (error) {
    console.error('Get pending NGOs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyNGO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;

    const ngo = await NGO.findByIdAndUpdate(
      ngoId,
      { verificationStatus: 'verified' },
      { new: true }
    );

    if (!ngo) {
      res.status(404).json({ error: 'NGO not found' });
      return;
    }

    res.json({
      message: 'NGO verified successfully',
      ngo
    });
  } catch (error) {
    console.error('Verify NGO error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const rejectNGO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;
    const { reason } = req.body;

    const ngo = await NGO.findByIdAndUpdate(
      ngoId,
      { 
        verificationStatus: 'rejected',
        rejectionReason: reason 
      },
      { new: true }
    );

    if (!ngo) {
      res.status(404).json({ error: 'NGO not found' });
      return;
    }

    res.json({
      message: 'NGO rejected successfully',
      ngo
    });
  } catch (error) {
    console.error('Reject NGO error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalNGOs = await NGO.countDocuments();
    const verifiedNGOs = await NGO.countDocuments({ verificationStatus: 'verified' });
    const pendingNGOs = await NGO.countDocuments({ verificationStatus: 'pending' });
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalDonations = await Donation.countDocuments();
    
    const recentDonations = await Donation.find()
      .populate('donorId', 'name')
      .populate('ngoId', 'organizationName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalNGOs,
        verifiedNGOs,
        pendingNGOs,
        totalDonors,
        totalDonations
      },
      recentDonations
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
