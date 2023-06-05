import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      firstName: string
      lastName: string
      age: number
      genre: string
      create_at: string
      session_id?: string
    },
    meals: {
      id: string
      name: string
      description: string
      healthy: string
      userId: string
      date: string
    }
  }
}