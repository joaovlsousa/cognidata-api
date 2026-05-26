import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { createSessionRequestDto } from '@/dtos/sessions/create-session-request-dto'
import { createSessionResponseDto } from '@/dtos/sessions/create-session-response-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { SessionsService } from '@/services/sessions-service'

export const createSessionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/sessions',
    {
      schema: {
        summary: 'Create Session',
        description: 'Create a new game session',
        tags: ['Sessions'],
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

      const sessionsService = new SessionsService(
        new DrizzleSessionsRepository()
      )
      const session = await sessionsService.create(applicatorId, sessionDto)

      return reply.status(201).send(session)
    }
  )
}
