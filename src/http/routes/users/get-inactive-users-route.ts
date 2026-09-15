import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getUsersDto } from '@/dtos/users/get-users-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetInactiveUsersUseCase } from '@/use-cases/users/get-inactive-users-use-case'

export const getInactiveUsersRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/inactive',
    {
      schema: {
        summary: 'Listar usuários inativos',
        description:
          'Lista os usuários inativos. Requer perfil de administrador.',
        tags: ['Usuários'],
        security: [{ bearerAuth: [] }],
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

      const getInactiveUsersUseCase = new GetInactiveUsersUseCase(
        new DrizzleUsersRepository()
      )

      const { users } = await getInactiveUsersUseCase.execute()

      return reply.status(200).send({
        users,
      })
    }
  )
}
