import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UsersService } from '@/services/users-service'

export const activateUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/users/:userId/activate',
    {
      schema: {
        summary: '',
        description: '',
        tags: ['Users'],
        params: z.object({
          userId: z.uuid(),
        }),
        response: {
          204: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isAdminCurrentUser()
      const { userId } = request.params

      const usersService = new UsersService(new DrizzleUsersRepository())
      await usersService.activateUser(userId)

      return reply.status(204).send()
    }
  )
}
