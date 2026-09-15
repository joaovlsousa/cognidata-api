import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { updateApplicatorUserDto } from '@/dtos/users/update-applicator-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { UpdateApplicatorUserUseCase } from '@/use-cases/users/update-applicator-user-use-case'

export const updateApplicatorUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/users/applicator',
    {
      schema: {
        summary: 'Atualizar usuário aplicador',
        description: 'Atualiza os dados do usuário aplicador autenticado.',
        tags: ['Usuários'],
        security: [{ bearerAuth: [] }],
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

      const updateApplicatorUserUseCase = new UpdateApplicatorUserUseCase(
        new DrizzleUsersRepository()
      )

      await updateApplicatorUserUseCase.execute(userId, userDto)

      return reply.status(204).send()
    }
  )
}
