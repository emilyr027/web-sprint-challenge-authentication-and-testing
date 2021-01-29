// Write your tests here
// const supertest = require('supertest');
const request  = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const jokes = require('../api/jokes/jokes-data');

const emily = { username: 'emryan', password: 'pineapple'}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

test('Sanity Check:', () => {
  expect(true).toBe(true);
});

describe('endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('responds with 400 if no credentials', () => {
      return request(server).post('/api/auth/register')
        .send({})
        .then(res => {
          expect(res.status).toBe(400)
        })
    })
  })  
  describe('[POST] /api/auth/register', () => {
    it('responds with the newly created user', async () => {
      const res = await request(server).post('/api/auth/register').send(emily)
      expect(res.body.id).toBe(1)
      expect(res.body.username).toBe('emryan')
    })
    it('if username is already taken, responds with "username taken"', async() => {
      await request(server).post('/api/auth/register').send(emily)
      const { body } = await request(server).post('/api/auth/register').send(emily)
      expect(JSON.stringify(body)).toEqual(expect.stringMatching(/username taken/))
    })
  })  

  describe('[POST] /api/auth/login', () => {
    it('responds with welcome message with username', async () => {
      await request(server).post('/api/auth/register').send(emily)
      const res = await request(server).post('/api/auth/login').send(emily)
      expect(res.status).toBe(200)
      expect(res.body.message).toMatch(/welcome, emryan/)
    })
    it('responds with a token when logging in', async() => {
      await request(server).post('/api/auth/register').send(emily)
      const res = await request(server).post('/api/auth/login').send(emily)
      expect(res.body).toHaveProperty('token')
    })
  })  

  describe('[GET] /api/jokes', () => {
    it('responds with an array', async () => {
      await request(server).post('/api/auth/register').send(emily)
      await request(server).post('/api/auth/login').send(emily)
      expect(jokes).toBeInstanceOf(Array)
    })
    it('expects jokes to have length of 3', async() => {
      await request(server).post('/api/auth/register').send(emily)
      await request(server).post('/api/auth/login').send(emily)
      expect(jokes).toHaveLength(3)
    })
  })
})