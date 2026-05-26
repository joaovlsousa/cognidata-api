import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getUserDto } from '@/dtos/users/get-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { UsersService } from '@/services/users-service'

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/profile',
    {
      schema: {
        summary: 'Get Profile Data',
        description: 'Retrieve the current user profile data.',
        tags: ['Users'],
        response: {
          200: getUserDto,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { sub: userId } = await request.getCurrentUser()

      const usersService = new UsersService(new DrizzleUsersRepository())
      const { user } = await usersService.getProfile(userId)

      return reply.status(200).send({
        user,
      })
    }
  )
}
