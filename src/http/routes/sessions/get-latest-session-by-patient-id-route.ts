import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleSessionsRepository } from '@/database/drizzle/repositories/drizzle-sessions-repository'
import { getLatestSessionByPatientIdDto } from '@/dtos/sessions/get-latest-session-by-patient-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetLatestSessionByPatientIdUseCase } from '@/use-cases/sessions/get-latest-session-by-patient-id-use-case'

export const getLatestSessionByPatientIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/patients/:patientId/sessions/latest',
    {
      schema: {
        summary: 'Consultar últimas sessões do paciente por habilidade',
        description:
          'Retorna a última sessão de cada habilidade do paciente informado.',
        tags: ['Sessões'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          200: getLatestSessionByPatientIdDto,
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

      const getLatestSessionByPatientIdUseCase =
        new GetLatestSessionByPatientIdUseCase(new DrizzleSessionsRepository())

      const response = await getLatestSessionByPatientIdUseCase.execute(
        patientId,
        applicatorId
      )

      return reply.status(200).send(response)
    }
  )
}
