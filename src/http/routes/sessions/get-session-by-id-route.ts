import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { getSessionByIdDto } from '@/dtos/sessions/get-session-by-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetSessionByIdUseCase } from '@/use-cases/sessions/get-session-by-id-use-case'

export const getSessionByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/sessions/:sessionId',
    {
      schema: {
        summary: 'Consultar dados da sessão',
        description: 'Retorna os dados brutos de uma sessão pelo ID.',
        tags: ['Sessões'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          sessionId: z.uuid(),
        }),
        response: {
          200: getSessionByIdDto,
          401: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isApplicatorCurrentUser()
      const { sub: applicatorId } = await request.getCurrentUser()
      const { sessionId } = request.params

      const getSessionByIdUseCase = new GetSessionByIdUseCase(
        new DrizzleSessionsRepository()
      )
      const session = await getSessionByIdUseCase.execute(
        sessionId,
        applicatorId
      )

      return reply.status(200).send(session)
    }
  )
}
