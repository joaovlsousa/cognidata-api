import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createPatientDto } from '@/dtos/patients/create-patient-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { CreatePatientUseCase } from '@/use-cases/patients/create-patient-use-case'

export const createPatientRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/patients',
    {
      schema: {
        summary: 'Criar paciente',
        description:
          'Cria um novo paciente associado ao aplicador autenticado.',
        tags: ['Pacientes'],
        security: [{ bearerAuth: [] }],
        body: createPatientDto,
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

      const createPatientUseCase = new CreatePatientUseCase(
        new DrizzleUsersRepository(),
        new DrizzlePatientsRepository()
      )

      await createPatientUseCase.execute(patientDto, applicatorId)

      return reply.status(201).send()
    }
  )
}
