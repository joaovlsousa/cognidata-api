import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleStudentsRepository } from '@/database/drizzle/repositories/drizzle-students-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createStudentDto } from '@/dtos/students/create-student-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { StudentsService } from '@/services/students-service'

export const createStudentRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/students',
    {
      schema: {
        summary: 'Create Student',
        description: 'Create a new student associated with the current applicator.',
        tags: ['Students'],
        body: createStudentDto,
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
      const studentDto = request.body

      const studentsService = new StudentsService(
        new DrizzleUsersRepository(),
        new DrizzleStudentsRepository()
      )
      await studentsService.create(studentDto, applicatorId)

      return reply.status(201).send()
    }
  )
}
