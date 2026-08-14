import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzlePatientsRepository } from '@/database/drizzle/repositories/drizzle-patients-repository'
import { getPatientsByApplicatorIdRequestDto } from '@/dtos/patients/get-patients-by-applicator-id-request-dto'
import { getPatientsByApplicatorIdResponseDto } from '@/dtos/patients/get-patients-by-applicator-id-response-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetPatientsByApplicatorIdUseCase } from '@/use-cases/patients/get-patients-by-applicator-id-use-case'

export const getPatientsByApplicatorIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/patients',
    {
      schema: {
        summary: 'Get Patients by Applicator ID',
        description:
          'Retrieve patients associated with the current applicator user.',
        tags: ['Patients'],
        querystring: getPatientsByApplicatorIdRequestDto,
        response: {
          200: getPatientsByApplicatorIdResponseDto,
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
      const options = request.query

      const getPatientsByApplicatorIdUseCase =
        new GetPatientsByApplicatorIdUseCase(new DrizzlePatientsRepository())

      const response = await getPatientsByApplicatorIdUseCase.execute(
        applicatorId,
        options
      )

      return reply.status(200).send(response)
    }
  )
}
