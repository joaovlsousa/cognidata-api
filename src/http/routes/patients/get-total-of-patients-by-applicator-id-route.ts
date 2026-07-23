import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getTotalOfPatientsByApplicatorIdDto } from '@/dtos/patients/get-total-of-patients-by-applicator-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { PatientsService } from '@/services/patients-service'

export const getTotalOfPatientsByApplicatorIdRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.get(
      '/patients/total',
      {
        schema: {
          summary: 'Get total patients by applicator ID',
          description:
            'Returns the total number of patients associated with the authenticated applicator.',
          tags: ['Patients'],
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

        const patientsService = new PatientsService(
          new DrizzleUsersRepository(),
          new DrizzlePatientsRepository()
        )
        const response =
          await patientsService.getTotalByApplicatorId(applicatorId)

        return reply.status(200).send(response)
      }
    )
  }
