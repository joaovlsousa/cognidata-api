import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createAdminUserDto } from '@/dtos/users/create-admin-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UsersService } from '@/services/users-service'

export const createAdminUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users/admin',
    {
      schema: {
        summary: 'Create Admin User',
        description: 'Create an administrator user in the system.',
        tags: ['Users'],
        body: createAdminUserDto,
        response: {
          201: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          409: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isMasterCurrentUser()
      const userDto = request.body

      const usersService = new UsersService(new DrizzleUsersRepository())
      await usersService.createAdminUser(userDto)

      return reply.status(201).send()
    }
  )
}
