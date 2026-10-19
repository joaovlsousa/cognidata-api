import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionItemsRepository } from '@/database/drizzle/repositories/drizzle-session-items-repository'
import {
  getAverageBySkillRequestDto,
  getAverageBySkillResponseDto,
} from '@/dtos/session-items/get-average-by-skill-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetAverageBySkillUseCase } from '@/use-cases/sessions-items/get-average-by-skill-use-case'

export const getAverageBySkillRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/sessions/items/average',
    {
      schema: {
        summary: 'Consultar evolução média da habilidade por item',
        description:
          'Retorna, para cada item da habilidade informada, a média do theta após a resposta e a dificuldade média.',
        tags: ['Itens de sessão'],
        security: [{ bearerAuth: [] }],
        querystring: getAverageBySkillRequestDto,
        response: {
          200: getAverageBySkillResponseDto,
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
      const { skill } = request.query

      const getAverageBySkillUseCase = new GetAverageBySkillUseCase(
        new DrizzleSessionItemsRepository()
      )
      const response = await getAverageBySkillUseCase.execute(
        skill,
        applicatorId
      )

      return reply.status(200).send(response)
    }
  )
}
