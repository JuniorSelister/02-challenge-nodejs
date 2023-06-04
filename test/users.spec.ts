import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('User can create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        firstName: 'Junior',
        lastName: 'Selister',
        age: 31,
        genre: 'male'
      })
      .expect(201)
  })
})