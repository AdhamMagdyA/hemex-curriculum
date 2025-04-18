const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/utils/prisma');
const bcrypt = require('bcryptjs');

describe('Protected Todo Routes', () => {
  let authToken;
  
  beforeAll(async () => {
    // Create test user with hashed password
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@auth.com',
        password: hashedPassword
      }
    });

    // Login to get token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@auth.com', password: 'testpassword' });
      
    authToken = res.body.token;
  });

  it('should reject unauthenticated POST /todos', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ 
        task: 'Test todo',
        completed: false
      });
    
    console.log('Test Error:', res.body); // Detailed error logging
    
    expect(res.statusCode).toEqual(401);
  });

  it('should allow authenticated POST /todos', async () => {
    const res = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        task: 'Test todo',
        completed: false
      });
    
    console.log('Test Error:', res.body); // Detailed error logging
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('task');
  });

  afterAll(async () => {
    // Cleanup
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();
  });
});
