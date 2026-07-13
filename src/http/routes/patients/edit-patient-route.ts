import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { savePatientDto } from '@/dtos/patients/save-patient-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { PatientsService } from '@/services/patients-service'

export const editPatientRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/patients/:patientId',
    {
      schema: {
        summary: 'Edit Patient',
        description: 'Edit a patient associated with the current applicator.',
        tags: ['Patients'],
        body: savePatientDto,
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          201: z.void(),
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
      const patientDto = request.body
      const { patientId } = request.params

      const patientsService = new PatientsService(
        new DrizzleUsersRepository(),
        new DrizzlePatientsRepository()
      )
      await patientsService.save(patientDto, applicatorId, patientId)

      return reply.status(201).send()
    }
  )
}
