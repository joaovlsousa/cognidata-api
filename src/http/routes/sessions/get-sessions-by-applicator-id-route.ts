import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { getSessionsByApplicatorIdRequestDto } from '@/dtos/sessions/get-sessions-by-applicator-id-request-dto'
import { getSessionsByApplicatorIdResponseDto } from '@/dtos/sessions/get-sessions-by-applicator-id-response-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetSessionsByApplicatorIdUseCase } from '@/use-cases/sessions/get-sessions-by-applicator-id-use-case'

export const getSessionsByApplicatorIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/sessions',
    {
      schema: {
        summary: 'Listar sessões do aplicador',
        description:
          'Lista as sessões associadas ao aplicador autenticado, com paginação e filtro opcional pelo nome do paciente.',
        tags: ['Sessões'],
        security: [{ bearerAuth: [] }],
        querystring: getSessionsByApplicatorIdRequestDto,
        response: {
          200: getSessionsByApplicatorIdResponseDto,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isApplicatorCurrentUser()
      const { sub: applicatorId } = await request.getCurrentUser()
      const options = request.query

      const getSessionsByApplicatorIdUseCase =
        new GetSessionsByApplicatorIdUseCase(new DrizzleSessionsRepository())

      const response = await getSessionsByApplicatorIdUseCase.execute(
        applicatorId,
        options
      )

      return reply.status(200).send(response)
    }
  )
}
