import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionItemsRepository } from '@/database/drizzle/repositories/drizzle-session-items-repository'
import {
  getThetaEvolutionBySkillRequestDto,
  getThetaEvolutionBySkillResponseDto,
} from '@/dtos/session-items/get-theta-evolution-by-skill-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetThetaEvolutionBySkillUseCase } from '@/use-cases/sessions-items/get-theta-evolution-by-skill-use-case'

export const getThetaEvolutionBySkillRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/sessions/:sessionId/items/theta-evolution',
    {
      schema: {
        summary: 'Consultar evolução do theta da sessão',
        description:
          'Retorna o theta de cada item da sessão informada para a habilidade selecionada.',
        tags: ['Itens de sessão'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          sessionId: z.uuid(),
        }),
        querystring: getThetaEvolutionBySkillRequestDto,
        response: {
          200: getThetaEvolutionBySkillResponseDto,
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
      const { sessionId } = request.params
      const { skill } = request.query

      const getThetaEvolutionBySkillUseCase =
        new GetThetaEvolutionBySkillUseCase(
          new DrizzleSessionItemsRepository()
        )
      const response = await getThetaEvolutionBySkillUseCase.execute(
        skill,
        sessionId,
        applicatorId
      )

      return reply.status(200).send(response)
    }
  )
}
