import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { PatientsService } from '@/services/patients-service'

export const createPatientsFromCsvRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.post(
    '/patients/csv',
    {
      schema: {
        summary: 'Create patients from CSV',
        description:
          'Create a new patients associated with the current applicator from CSV file.',
        tags: ['Patients'],
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

      const file = await request.file({
        limits: {
          files: 1,
          fileSize: 5 * 1024 * 1024, // 5 MB
        },
      })

      if (!file || file.mimetype !== 'text/csv') {
        throw new BadRequestError('Arquivo CSV é obrigatório.')
      }

      const buffer = await file.toBuffer()
      const csvContent = buffer.toString('utf-8')

      const patientsService = new PatientsService(
        new DrizzleUsersRepository(),
        new DrizzlePatientsRepository()
      )
      await patientsService.createFromCsv(csvContent, applicatorId)

      return reply.status(201).send()
    }
  )
}
