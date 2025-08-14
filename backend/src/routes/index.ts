import { Router } from 'express';
import {
  verifyAadhaar,
  verifyOtp,
  submitRegistration,
  getRegistration
} from '../controllers/registration.controller';

const router = Router();

// Aadhaar verification routes
router.post('/verify-aadhaar', verifyAadhaar);
router.post('/verify-otp', verifyOtp);

// Registration routes
router.post('/submit', submitRegistration);
router.get('/registration/:aadhaarNumber', getRegistration);

export default router;