import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { PatientsService } from '@/services/patients-service'

export const deletePatientByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/patients/:patientId',
    {
      schema: {
        summary: 'Delete patient by ID',
        description: 'Delete a patient by the provided ID.',
        tags: ['Patients'],
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          204: z.void(),
          401: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
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
      await patientsService.deleteById(patientId)

      return reply.status(204).send()
    }
  )
}
