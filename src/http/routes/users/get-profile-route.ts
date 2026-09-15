import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getUserDto } from '@/dtos/users/get-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { GetUserProfileUseCase } from '@/use-cases/users/get-user-profile-use-case'

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/profile',
    {
      schema: {
        summary: 'Consultar perfil',
        description: 'Consulta os dados do perfil do usuário autenticado.',
        tags: ['Usuários'],
        security: [{ bearerAuth: [] }],
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

      const getUserProfileUseCase = new GetUserProfileUseCase(
        new DrizzleUsersRepository()
      )

      const { user } = await getUserProfileUseCase.execute(userId)

      return reply.status(200).send({
        user,
      })
    }
  )
}
