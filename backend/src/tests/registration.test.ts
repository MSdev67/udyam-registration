import request from 'supertest';
import app from '../index';
import { sequelize, UdyamRegistration } from '../models';

describe('Registration API', () => {
  const testData = {
    aadhaarNumber: '123456789012',
    nameAsPerAadhaar: 'Test User',
    panNumber: 'ABCDE1234F'
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Aadhaar Verification', () => {
    it('should verify Aadhaar', async () => {
      const response = await request(app)
        .post('/api/verify-aadhaar')
        .send({ aadhaarNumber: testData.aadhaarNumber });
      
      expect(response.status).toBe(200);
      expect(response.body.otpSent).toBe(true);
    });

    it('should verify OTP', async () => {
      const response = await request(app)
        .post('/api/verify-otp')
        .send({ aadhaarNumber: testData.aadhaarNumber, otp: '123456' });
      
      expect(response.status).toBe(200);
      expect(response.body.verified).toBe(true);
    });
  });

  describe('Registration Submission', () => {
    it('should submit registration', async () => {
      const response = await request(app)
        .post('/api/submit')
        .send(testData);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration submitted successfully');
    });

    it('should get registration', async () => {
      await UdyamRegistration.create(testData);
      
      const response = await request(app)
        .get(`/api/registration/${testData.aadhaarNumber}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.aadhaarNumber).toBe(testData.aadhaarNumber);
    });

    it('should reject duplicate registration', async () => {
      // First submission
      await request(app).post('/api/submit').send(testData);
      
      // Second submission with same Aadhaar
      const response = await request(app)
        .post('/api/submit')
        .send(testData);
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Aadhaar number already registered');
    });
  });
});