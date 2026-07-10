import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getAllPatientsByApplicatorIdDto } from '@/dtos/patients/get-all-patients-by-applicator-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { PatientsService } from '@/services/patients-service'

export const getAllPatientsByApplicatorIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/patients',
    {
      schema: {
        summary: 'Get All Patients by Applicator ID',
        description:
          'Retrieve all patients associated with the current applicator user.',
        tags: ['Patients'],
        response: {
          200: getAllPatientsByApplicatorIdDto,
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
      const patients = await patientsService.getAllByApplicatorId(applicatorId)

      return reply.status(200).send(patients)
    }
  )
}
