import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { createAdminUserDto } from '@/dtos/users/create-admin-user-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { CreateAdminUserUseCase } from '@/use-cases/users/create-admin-user-use-case'

export const createAdminUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users/admin',
    {
      schema: {
        summary: 'Criar usuário administrador',
        description: 'Cria um usuário com perfil de administrador.',
        tags: ['Usuários'],
        security: [{ bearerAuth: [] }],
        body: createAdminUserDto,
        response: {
          201: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          409: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      const userDto = request.body

      const createAdminUserUseCase = new CreateAdminUserUseCase(
        new DrizzleUsersRepository()
      )

      await createAdminUserUseCase.execute(userDto)

      return reply.status(201).send()
    }
  )
}
