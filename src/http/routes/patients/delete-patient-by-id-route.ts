import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { DeletePatientByIdUseCase } from '@/use-cases/patients/delete-patient-by-id-use-case'

export const deletePatientByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/patients/:patientId',
    {
      schema: {
        summary: 'Excluir paciente por ID',
        description: 'Exclui um paciente pelo ID informado.',
        tags: ['Pacientes'],
        security: [{ bearerAuth: [] }],
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

      const deletePatientByIdUseCase = new DeletePatientByIdUseCase(
        new DrizzlePatientsRepository()
      )

      await deletePatientByIdUseCase.execute(patientId)

      return reply.status(204).send()
    }
  )
}
