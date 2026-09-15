import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { createSessionRequestDto } from '@/dtos/sessions/create-session-request-dto'
import { createSessionResponseDto } from '@/dtos/sessions/create-session-response-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { CreateSessionUseCase } from '@/use-cases/sessions/create-session-use-case'

export const createSessionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/sessions',
    {
      schema: {
        summary: 'Criar sessão',
        description: 'Cria uma nova sessão do jogo.',
        tags: ['Sessões'],
        security: [{ bearerAuth: [] }],
        body: createSessionRequestDto,
        response: {
          201: createSessionResponseDto,
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
      const { sub: applicatorId } = await request.getCurrentUser()
      const sessionDto = request.body

      const createSessionUseCase = new CreateSessionUseCase(
        new DrizzleSessionsRepository()
      )

      const session = await createSessionUseCase.execute(
        applicatorId,
        sessionDto
      )

      return reply.status(201).send(session)
    }
  )
}
