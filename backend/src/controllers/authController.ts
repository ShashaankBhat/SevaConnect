import { Request, Response } from 'express';
import User from '../models/User';
import NGO from '../models/NGO';
import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

export const registerNGO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, organizationName, description, contact, address, category } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      phone,
      role: 'ngo'
    });

    await user.save();

    // Create NGO profile with default location (can be updated later)
    const ngo = new NGO({
      userId: user._id,
      organizationName,
      description,
      contact,
      address: {
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        zipCode: address?.zipCode || '',
        country: address?.country || 'India'
      },
      location: {
        lat: address?.lat || 19.0760, // Default to Mumbai
        lng: address?.lng || 72.8777
      },
      category,
      needs: []
    });

    await ngo.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: 'NGO registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        ngoId: ngo._id,
        organizationName: ngo.organizationName,
        verificationStatus: ngo.verificationStatus
      }
    });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerDonor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const user = new User({
      email,
      password,
      name,
      phone,
      role: 'donor',
      isVerified: false
    });

    await user.save();

    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: 'Donor registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Donor registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    let profileData = {};

    if (user.role === 'ngo') {
      const ngo = await NGO.findOne({ userId: user._id });
      profileData = {
        ngoId: ngo?._id,
        organizationName: ngo?.organizationName,
        verificationStatus: ngo?.verificationStatus
      };
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        ...profileData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
