import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { getTotalOfPatientsByApplicatorIdDto } from '@/dtos/patients/get-total-of-patients-by-applicator-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetTotalOfPatientsWithAlertByApplicatorIdUseCase } from '@/use-cases/patients/get-total-of-patients-with-alert-by-applicator-id-use-case'

export const getTotalOfPatientsWithAlertByApplicatorIdRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.get(
      '/patients/with-alert/total',
      {
        schema: {
          summary: 'Consultar totais de pacientes em alerta',
          description:
            'Retorna o total de pacientes em alerta associados ao aplicador autenticado e o total cadastrado no mês atual.',
          tags: ['Pacientes'],
          security: [{ bearerAuth: [] }],
          response: {
            200: getTotalOfPatientsByApplicatorIdDto,
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

        const getTotalOfPatientsWithAlertByApplicatorIdUseCase =
          new GetTotalOfPatientsWithAlertByApplicatorIdUseCase(
            new DrizzlePatientsRepository()
          )

        const response =
          await getTotalOfPatientsWithAlertByApplicatorIdUseCase.execute(
            applicatorId
          )

        return reply.status(200).send(response)
      }
    )
  }
