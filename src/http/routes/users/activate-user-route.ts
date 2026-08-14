import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { ActivateUserUseCase } from '@/use-cases/users/activate-user-use-case'

export const activateUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/users/:userId/activate',
    {
      schema: {
        summary: 'Activate User',
        description: 'Activate a user by ID (admin only).',
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

      const activateUserUseCase = new ActivateUserUseCase(
        new DrizzleUsersRepository()
      )

      await activateUserUseCase.execute(userId)

      return reply.status(204).send()
    }
  )
}
