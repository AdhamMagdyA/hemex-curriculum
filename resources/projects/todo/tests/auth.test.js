const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma');

describe('Protected Todo Routes', () => {
  let authToken;
  
  beforeAll(async () => {
    // Create test user
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@auth.com',
        password: 'hashed_password'
      }
    });

    // Login to get token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@auth.com', password: 'hashed_password' });
      
    authToken = res.body.token;
  });

  it('should reject unauthenticated POST /todos', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ task: 'Test todo' });
    
    expect(res.statusCode).toEqual(401);
  });

  it('should allow authenticated POST /todos', async () => {
    const res = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ task: 'Test todo' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE User, Todo RESTART IDENTITY CASCADE;`;
  });
});
