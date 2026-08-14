import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createApplicatorUserDto } from '@/dtos/users/create-applicator-user-dto'
import { CreateApplicatorUserUseCase } from '@/use-cases/users/create-applicator-user-use-case'

export const createApplicatorUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users/applicator',
    {
      schema: {
        summary: 'Create Applicator User',
        description: 'Create an applicator user.',
        tags: ['Users'],
        body: createApplicatorUserDto,
        response: {
          201: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          409: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const userDto = request.body

      const createApplicatorUserUseCase = new CreateApplicatorUserUseCase(
        new DrizzleUsersRepository()
      )

      await createApplicatorUserUseCase.execute(userDto)

      return reply.status(201).send()
    }
  )
}
