import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'

export const signOutRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/auth/sign-out',
    {
      schema: {
        summary: '',
        description: '',
        tags: ['Auth'],
        response: {
          204: z.void(),
          400: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (_request, reply) => {
      return reply
        .clearCookie('token', {
          path: '/',
        })
        .status(204)
        .send()
    }
  )
}
