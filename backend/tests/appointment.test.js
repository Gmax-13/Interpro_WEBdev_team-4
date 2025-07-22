const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Clinic = require('../src/models/Clinic');
const Appointment = require('../src/models/Appointment');

// This is a minimal integration test for appointment booking flow

describe('Appointment Booking API', () => {
  let token, doctor, clinic;

  beforeAll(async () => {
    // Connect to test DB (assumes test env)
    await mongoose.connect(process.env.MONGO_URI);
    // Create test user, doctor, clinic
    const user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'patient' });
    doctor = await Doctor.create({ user: user._id, specializations: ['Cardiology'] });
    clinic = await Clinic.create({ name: 'Test Clinic', address: '123 Main St', services: ['Cardiology'], doctors: [doctor._id] });
    // Get JWT token (simulate login)
    token = 'Bearer ' + user.generateJWT();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Clinic.deleteMany({});
    await Appointment.deleteMany({});
    await mongoose.disconnect();
  });

  it('should book an appointment', async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', token)
      .send({
        doctor: doctor._id,
        clinic: clinic._id,
        date: '2025-07-20',
        timeSlot: '10:00 AM',
        service: 'Cardiology',
        notes: 'Test appointment'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.appointment).toBeDefined();
  });
});
