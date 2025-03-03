const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Mock environment variables
process.env.JWT_SECRET = 'test_secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/blog_test';

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with existing email', async () => {
    // Create a user first
    await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login an existing user', async () => {
    // Create a user
    const user = new User({
      username: 'logintest',
      email: 'login@example.com',
      password: 'password123'
    });
    
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});