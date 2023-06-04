import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export async function mealRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals')
      .select()

    return { meals }
  })

  app.get('/:id', async (req, res) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealsParamsSchema.parse(req.params)
    const meals = await knex('meals')
      .where({
        id,
      })
      .first()

    return { meals }
  })

  app.get('/healthy', async () => {
    const healthy = await knex('meals')
      .where('healthy', '=', 'Yes')
      .count('healthy', { as: 'amount'})
      .first()
    
    return { healthy }
  })

  app.get('/nohealthy', async () => {
    const nohealthy = await knex('meals')
      .where('healthy', '=', 'No')
      .count('healthy', { as: 'amount'})
      .first()
    
    return { nohealthy }
  })

  app.get('/total', async () => {
    const total = await knex('meals')
      .count('id', { as: 'amount'})
      .first()
    
      return { total }
  })

  app.get('/betterseq', async () => {
    const betterseq = await knex('meals')
      .where('healthy', '=', 'Yes')
      .count('healthy', { as: 'Better sequence'})
      .first()

    return { betterseq }
  })

  app.post('/', async (req, res) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      healthy: z.enum(['Yes', 'No']),
      userId: z.string()
    })

    const { name, description, healthy, userId } = createMealsBodySchema.parse(req.body)

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      healthy,
      userId
    })

    return res.status(201).send()
  })

  app.put('/:id', async (req, res) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealsParamsSchema.parse(req.params)

    const updateMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      healthy: z.enum(['Yes', 'No']),
      date: z.string(),
      userId: z.string()
    })

    const { name, description, healthy, date, userId } = updateMealsBodySchema.parse(req.body)

    await knex('meals').update({
      name,
      description,
      healthy,
      date,
      userId
    }).where({
      id
    })

    return res.status(204).send()
  })

  app.put('/mockdate/:id', async (req, res) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealsParamsSchema.parse(req.params)

    const updateMealsBodySchema = z.object({
      date: z.string()
    })

    const { date } = updateMealsBodySchema.parse(req.body)

    await knex('meals').update({
      date
    }).where({
      id
    })

    return res.status(204).send()
  })

  app.delete('/:id', async (req, res) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealsParamsSchema.parse(req.params)

    await knex('meals')
      .delete()
      .where({
        id
      })

    return res.status(204).send()
  })
}