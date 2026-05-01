import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createMasterUserDto } from '@/dtos/users/create-master-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UsersService } from '@/services/users-service'

export const createMasterUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users/master',
    {
      schema: {
        summary: 'Create Master User',
        tags: ['Users'],
        body: createMasterUserDto,
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
      await usersService.createMasterUser(userDto)

      return reply.status(201).send()
    }
  )
}
