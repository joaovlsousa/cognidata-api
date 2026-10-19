import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { getSessionsByPatientIdDto } from '@/dtos/sessions/get-sessions-by-patient-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetSessionsByPatientIdUseCase } from '@/use-cases/sessions/get-sessions-by-patient-id-use-case'

export const getSessionsByPatientIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/patients/:patientId/sessions',
    {
      schema: {
        summary: 'Listar sessões do paciente',
        description:
          'Lista as sessões do paciente autenticado, da mais recente para a mais antiga.',
        tags: ['Sessões'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          200: getSessionsByPatientIdDto,
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
      const { patientId } = request.params

      const getSessionsByPatientIdUseCase = new GetSessionsByPatientIdUseCase(
        new DrizzleSessionsRepository()
      )
      const response = await getSessionsByPatientIdUseCase.execute(
        patientId,
        applicatorId
      )

      return reply.status(200).send(response)
    }
  )
}
