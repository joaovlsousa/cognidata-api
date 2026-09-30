import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { DeletePatientsByIdListUseCase } from '@/use-cases/patients/delete-patients-by-id-list-use-case'

export const deletePatientsByIdListRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.delete(
    '/patients',
    {
      schema: {
        summary: 'Excluir pacientes por lista de IDs',
        description: 'Exclui vários pacientes a partir de uma lista de IDs.',
        tags: ['Pacientes'],
        security: [{ bearerAuth: [] }],
        body: z.object({
          patientsIds: z.array(z.uuid()),
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
      const { patientsIds } = request.body

      const deletePatientsByIdListUseCase = new DeletePatientsByIdListUseCase(
        new DrizzlePatientsRepository()
      )

      await deletePatientsByIdListUseCase.execute(patientsIds)

      return reply.status(204).send()
    }
  )
}
