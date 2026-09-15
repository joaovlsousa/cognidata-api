import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { getPatientByIdDto } from '@/dtos/patients/get-patient-by-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetPatientByIdUseCase } from '@/use-cases/patients/get-patient-by-id-use-case'

export const getPatientByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/patients/:patientId',
    {
      schema: {
        summary: 'Consultar paciente por ID',
        description: 'Consulta um paciente pelo ID informado.',
        tags: ['Pacientes'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          patientId: z.uuid(),
        }),
        response: {
          200: getPatientByIdDto,
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

      const getPatientByIdUseCase = new GetPatientByIdUseCase(
        new DrizzlePatientsRepository()
      )

      const patient = await getPatientByIdUseCase.execute(patientId)

      return reply.status(200).send(patient)
    }
  )
}
