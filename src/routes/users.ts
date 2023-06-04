import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function userRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists]}, async (req, res) => {
    const { sessionId } = req.cookies
    const users = await knex('users')
      .where('session_id', sessionId)
      .select()

    return { users }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists]}, async (req, res) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUsersParamsSchema.parse(req.params)
    const { sessionId } = req.cookies
    const users = await knex('users')
      .where({
        session_id: sessionId,
        id,
      })
      .first()
    
    return { users }
  })

  app.post('/', async (req, res) => {
    const createUserBodySchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      age: z.number(),
      genre: z.enum(['male', 'female'])
    })

    const { firstName, lastName, age, genre } = createUserBodySchema.parse(req.body)
    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/users',
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      firstName,
      lastName,
      age,
      genre,
      session_id: sessionId
    })

    return res.status(201).send()
  })

  app.put('/:id', async (req, res) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getUsersParamsSchema.parse(req.params)

    const updateUsersBodySchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      age: z.number(),
      genre: z.enum(['male', 'female'])
    })

    const { firstName, lastName, age, genre } = updateUsersBodySchema.parse(req.body)

    await knex('users').update({
      firstName,
      lastName,
      age,
      genre
    }).where({
      id
    })

    return res.status(204).send()
  })

  app.delete('/:id', async (req, res) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getUsersParamsSchema.parse(req.params)

    await knex('users')
      .delete()
      .where({
        id
      })

    return res.status(204).send()
  })
}