import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createApplicatorUserDto } from '@/dtos/users/create-applicator-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UsersService } from '@/services/users-service'

export const createApplicatorUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users/applicator',
    {
      schema: {
        summary: 'Create Applicator User',
        description:
          'Create an applicator user associated with an administrator.',
        tags: ['Users'],
        body: createApplicatorUserDto,
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
      await request.isAdminCurrentUser()
      const { sub: adminId } = await request.getCurrentUser()
      const userDto = request.body

      const usersService = new UsersService(new DrizzleUsersRepository())
      await usersService.createApplicatorUser(adminId, userDto)

      return reply.status(201).send()
    }
  )
}
