import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { getTotalOfSessionsByApplicatorIdDto } from '@/dtos/sessions/get-total-of-sessions-by-applicator-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetTotalOfSessionsByApplicatorIdUseCase } from '@/use-cases/sessions/get-total-of-sessions-by-applicator-id-use-case'

export const getTotalOfSessionsByApplicatorIdRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.get(
      '/sessions/total',
      {
        schema: {
          summary: 'Consultar totais de sessões',
          description:
            'Retorna o total de sessões associadas ao aplicador autenticado e o total cadastrado no mês atual.',
          tags: ['Sessões'],
          security: [{ bearerAuth: [] }],
          response: {
            200: getTotalOfSessionsByApplicatorIdDto,
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

        const getTotalOfSessionsByApplicatorIdUseCase =
          new GetTotalOfSessionsByApplicatorIdUseCase(
            new DrizzleSessionsRepository()
          )

        const response =
          await getTotalOfSessionsByApplicatorIdUseCase.execute(applicatorId)

        return reply.status(200).send(response)
      }
    )
  }
