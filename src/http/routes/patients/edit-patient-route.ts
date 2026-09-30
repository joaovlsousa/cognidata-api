import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { editPatientDto } from '@/dtos/patients/edit-patient-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { EditPatientUseCase } from '@/use-cases/patients/edit-patient-use-case'

export const editPatientRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/patients/:patientId',
    {
      schema: {
        summary: 'Editar paciente',
        description: 'Edita um paciente associado ao aplicador autenticado.',
        tags: ['Pacientes'],
        security: [{ bearerAuth: [] }],
        body: editPatientDto,
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          204: z.void(),
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

      const editPatientUseCase = new EditPatientUseCase(
        new DrizzleUsersRepository(),
        new DrizzlePatientsRepository()
      )

      await editPatientUseCase.execute(patientDto, patientId, applicatorId)

      return reply.status(204).send()
    }
  )
}
