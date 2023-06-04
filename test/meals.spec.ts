import { it, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Users can create a new meals', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Café saudável',
        description: 'Pão integral com manteiga e suco de laranja',
        healthy: 'Yes',
        userId: '9a40170a-178e-466b-a7dc-38af5627688d'
      })
      .expect(201)
  })

})