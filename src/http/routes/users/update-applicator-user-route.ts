import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { updateApplicatorUserDto } from '@/dtos/users/update-applicator-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UsersService } from '@/services/users-service'

export const updateApplicatorUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/users/applicator',
    {
      schema: {
        summary: 'Update Applicator User',
        description: '',
        tags: ['Users'],
        body: updateApplicatorUserDto,
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
      await request.isApplicatorCurrentUser()
      const { sub: userId } = await request.getCurrentUser()
      const userDto = request.body

      const usersService = new UsersService(new DrizzleUsersRepository())
      await usersService.updateApplicatorUser(userId, userDto)

      return reply.status(204).send()
    }
  )
}
