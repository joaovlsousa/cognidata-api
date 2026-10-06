import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { getAverageByApplicatorIdDto } from '@/dtos/sessions/get-average-by-applicator-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetAverageByApplicatorIdUseCase } from '@/use-cases/sessions/get-average-by-applicator-id-use-case'

export const getAverageByApplicatorIdRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.get(
      '/sessions/average',
      {
        schema: {
          summary: 'Consultar médias das sessões por habilidade',
          description:
            'Retorna a média do theta final das sessões do aplicador autenticado, agrupada por habilidade. Skills sem sessões retornam null.',
          tags: ['Sessões'],
          security: [{ bearerAuth: [] }],
          response: {
            200: getAverageByApplicatorIdDto,
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

        const getAverageByApplicatorIdUseCase =
          new GetAverageByApplicatorIdUseCase(new DrizzleSessionsRepository())

        const response =
          await getAverageByApplicatorIdUseCase.execute(applicatorId)

        return reply.status(200).send(response)
      }
    )
  }
