import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { CreatePatientsFromCsvUseCase } from '@/use-cases/patients/create-patients-from-csv-use-case'

export const createPatientsFromCsvRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.post(
    '/patients/csv',
    {
      schema: {
        summary: 'Criar pacientes a partir de CSV',
        description:
          'Cria pacientes associados ao aplicador autenticado a partir de um arquivo CSV. O arquivo deve ser CSV, com no máximo 5 MB.',
        tags: ['Pacientes'],
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        body: z.object({
          file: z.string().meta({
            format: 'binary',
            description: 'Arquivo CSV contendo os dados dos pacientes.',
          }),
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

      const createPatientsFromCsvUseCase = new CreatePatientsFromCsvUseCase(
        new DrizzlePatientsRepository()
      )

      await createPatientsFromCsvUseCase.execute(csvContent, applicatorId)

      return reply.status(201).send()
    }
  )
}
