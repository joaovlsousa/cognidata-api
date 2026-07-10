import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getPatientByIdDto } from '@/dtos/patients/get-patient-by-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { PatientsService } from '@/services/patients-service'

export const getPatientByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/patients/:patientId',
    {
      schema: {
        summary: '',
        description: '',
        tags: ['Patients'],
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          200: getPatientByIdDto,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isApplicatorCurrentUser()
      const { patientId } = request.params

      const patientsService = new PatientsService(
        new DrizzleUsersRepository(),
        new DrizzlePatientsRepository()
      )
      const patient = await patientsService.getById(patientId)

      return reply.status(200).send(patient)
    }
  )
}
