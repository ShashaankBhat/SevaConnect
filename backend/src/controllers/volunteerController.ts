import { Request, Response } from 'express';
import Volunteer from '../models/Volunteer';
import User from '../models/User';
import NGO from '../models/NGO';

export const applyAsVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donorId, ngoId, skills, availability, message } = req.body;

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

    // Check if already applied
    const existingApplication = await Volunteer.findOne({ donorId, ngoId });
    if (existingApplication) {
      res.status(400).json({ error: 'You have already applied to volunteer for this NGO' });
      return;
    }

    // Create volunteer application
    const volunteer = new Volunteer({
      donorId,
      ngoId,
      ngoName: ngo.organizationName,
      skills,
      availability,
      message,
      status: 'pending'
    });

    await volunteer.save();

    res.status(201).json({
      message: 'Volunteer application submitted successfully',
      applicationId: volunteer._id,
      volunteer
    });
  } catch (error) {
    console.error('Volunteer application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDonorVolunteerApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donorId } = req.params;

    const applications = await Volunteer.find({ donorId })
      .populate('ngoId', 'organizationName category contact')
      .sort({ applicationDate: -1 });

    res.json({
      applications
    });
  } catch (error) {
    console.error('Get donor volunteer applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNGOVolunteerApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;

    const applications = await Volunteer.find({ ngoId })
      .populate('donorId', 'name email phone')
      .sort({ applicationDate: -1 });

    res.json({
      applications
    });
  } catch (error) {
    console.error('Get NGO volunteer applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateVolunteerStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const application = await Volunteer.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('donorId', 'name email')
     .populate('ngoId', 'organizationName');

    if (!application) {
      res.status(404).json({ error: 'Volunteer application not found' });
      return;
    }

    res.json({
      message: 'Volunteer application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update volunteer status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
