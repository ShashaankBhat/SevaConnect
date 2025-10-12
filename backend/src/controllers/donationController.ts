import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Donation from '../models/Donation';
import User from '../models/User';
import NGO from '../models/NGO';

export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donorId, ngoId, items, notes, type } = req.body;

    // Verify donor exists
    const donor = await User.findById(donorId);
    if (!donor || donor.role !== 'donor') {
      res.status(400).json({ error: 'Invalid donor' });
      return;
    }

    // Verify NGO exists and get name
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      res.status(400).json({ error: 'NGO not found' });
      return;
    }

    // Create donation
    const donation = new Donation({
      donorId,
      ngoId,
      ngoName: ngo.organizationName,
      items,
      notes,
      type: type || 'goods',
      status: 'pending'
    });

    await donation.save();

    res.status(201).json({
      message: 'Donation created successfully',
      donationId: donation._id,
      donation
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDonorDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donorId } = req.params;

    const donations = await Donation.find({ donorId })
      .populate('ngoId', 'organizationName category')
      .sort({ createdAt: -1 });

    res.json({
      donations
    });
  } catch (error) {
    console.error('Get donor donations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNGODonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;

    const donations = await Donation.find({ ngoId })
      .populate('donorId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      donations
    });
  } catch (error) {
    console.error('Get NGO donations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDonationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    // Validate donationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      res.status(400).json({ error: 'Invalid donation ID' });
      return;
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'received', 'delivered'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { status },
      { new: true }
    );

    if (!donation) {
      res.status(404).json({ error: 'Donation not found' });
      return;
    }

    res.json({
      message: 'Donation status updated successfully',
      donation
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
