import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionItemsRepository } from '@/database/drizzle/repositories/drizzle-session-items-repository'
import { createSessionItemsDto } from '@/dtos/session-items/create-session-items-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { CreateSessionItemsUseCase } from '@/use-cases/sessions-items/create-session-items-use-case'

export const createSessionItemRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/sessions/:sessionId/items',
    {
      schema: {
        summary: 'Criar item de sessão',
        description: 'Salva um item da sessão do jogo.',
        tags: ['Sessões'],
        security: [{ bearerAuth: [] }],
        body: createSessionItemsDto,
        params: z.object({
          sessionId: z.uuid(),
        }),
        response: {
          201: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isApplicatorCurrentUser()
      const sessionDto = request.body
      const { sessionId } = request.params

      const createSessionItemsUseCase = new CreateSessionItemsUseCase(
        new DrizzleSessionItemsRepository()
      )

      await createSessionItemsUseCase.execute(sessionId, sessionDto)

      return reply.status(201).send()
    }
  )
}
