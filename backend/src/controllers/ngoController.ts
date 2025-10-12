import { Request, Response } from 'express';
import NGO from '../models/NGO';

export const getAllNGOs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all verified NGOs
    const ngos = await NGO.find({ verificationStatus: 'verified' })
      .select('organizationName description address location category needs contact verificationStatus')
      .lean();

    res.json({
      ngos
    });
  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNGOById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;

    const ngo = await NGO.findById(ngoId)
      .select('organizationName description address location category needs contact verificationStatus');

    if (!ngo) {
      res.status(404).json({ error: 'NGO not found' });
      return;
    }

    res.json({
      ngo
    });
  } catch (error) {
    console.error('Get NGO by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNGO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;
    const updateData = req.body;

    const ngo = await NGO.findByIdAndUpdate(
      ngoId,
      updateData,
      { new: true }
    );

    if (!ngo) {
      res.status(404).json({ error: 'NGO not found' });
      return;
    }

    res.json({
      message: 'NGO updated successfully',
      ngo
    });
  } catch (error) {
    console.error('Update NGO error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addNgoNeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params;
    const { need } = req.body;

    const ngo = await NGO.findByIdAndUpdate(
      ngoId,
      { $push: { needs: need } },
      { new: true }
    );

    if (!ngo) {
      res.status(404).json({ error: 'NGO not found' });
      return;
    }

    res.json({
      message: 'Need added successfully',
      needs: ngo.needs
    });
  } catch (error) {
    console.error('Add NGO need error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
