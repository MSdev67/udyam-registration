import { Request, Response } from 'express';
import { UdyamRegistration } from '../models';

export const verifyAadhaar = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;
    
    if (!aadhaarNumber) {
      return res.status(400).json({ error: 'Aadhaar number is required' });
    }

    // Validate Aadhaar format
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ error: 'Invalid Aadhaar number format' });
    }

    // Mock OTP verification
    return res.status(200).json({
      message: 'OTP sent to registered mobile number',
      otpSent: true,
      mockOtp: '123456' // Only for development
    });
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber, otp } = req.body;
    
    if (!aadhaarNumber || !otp) {
      return res.status(400).json({ error: 'Aadhaar number and OTP are required' });
    }

    // Mock verification - in real app, verify with UIDAI
    if (otp !== '123456') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    return res.status(200).json({
      message: 'Aadhaar verified successfully',
      verified: true,
      mockName: 'Test User' // Mock name for development
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitRegistration = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber, nameAsPerAadhaar, panNumber } = req.body;
    
    // Validate input
    if (!aadhaarNumber || !nameAsPerAadhaar || !panNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already registered
    const existingRegistration = await UdyamRegistration.findOne({
      where: { aadhaarNumber }
    });

    if (existingRegistration) {
      return res.status(409).json({ error: 'Aadhaar number already registered' });
    }

    // Create new registration
    const registration = await UdyamRegistration.create({
      aadhaarNumber,
      nameAsPerAadhaar,
      panNumber
    });

    return res.status(201).json({
      message: 'Registration submitted successfully',
      data: registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRegistration = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.params;
    
    const registration = await UdyamRegistration.findOne({
      where: { aadhaarNumber }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    return res.status(200).json({
      data: registration
    });
  } catch (error) {
    console.error('Get registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};