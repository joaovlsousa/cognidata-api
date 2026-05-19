import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleStudentsRepository } from '@/database/drizzle/repositories/drizzle-students-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { getAllStudentsByApplicatorIdDto } from '@/dtos/students/get-all-students-by-applicator-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { StudentsService } from '@/services/students-service'

export const getAllStudentsByApplicatorIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/students',
    {
      schema: {
        summary: 'Get All Students by Applicator ID',
        description:
          'Retrieve all students associated with the current applicator user.',
        tags: ['Students'],
        response: {
          200: getAllStudentsByApplicatorIdDto,
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

      const studentsService = new StudentsService(
        new DrizzleUsersRepository(),
        new DrizzleStudentsRepository()
      )
      const students = await studentsService.getAllByApplicatorId(applicatorId)

      return reply.status(200).send(students)
    }
  )
}
