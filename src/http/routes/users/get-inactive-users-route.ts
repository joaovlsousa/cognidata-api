import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getUsersDto } from '@/dtos/users/get-users-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UsersService } from '@/services/users-service'

export const getInactiveUsersRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/inactive',
    {
      schema: {
        summary: 'Get Inactive Users',
        description: 'Retrieve a list of inactive users (admin only).',
        tags: ['Users'],
        response: {
          200: getUsersDto,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isAdminCurrentUser()

      const usersService = new UsersService(new DrizzleUsersRepository())
      const { users } = await usersService.getInactiveUsers()

      return reply.status(200).send({
        users,
      })
    }
  )
}
