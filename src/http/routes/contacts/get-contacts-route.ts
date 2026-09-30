import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleContactsRepository } from '@/database/drizzle/repositories/drizzle-contacts-repository'
import { filtersContactsDto } from '@/dtos/contacts/filters-contacts-dto'
import { getContactsDto } from '@/dtos/contacts/get-contacts-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { GetContactsUseCase } from '@/use-cases/contacts/get-contacts-use-case'

export const getContactsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/contacts',
    {
      schema: {
        summary: 'Listar contatos',
        description:
          'Lista todos os contatos, com filtragem opcional por status.',
        tags: ['Contatos'],
        security: [{ bearerAuth: [] }],
        querystring: filtersContactsDto,
        response: {
          200: getContactsDto,
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isAdminCurrentUser()
      const filters = request.query

      const getContactsUseCase = new GetContactsUseCase(
        new DrizzleContactsRepository()
      )

      const { contacts } = await getContactsUseCase.execute(filters)

      return reply.status(200).send({
        contacts,
      })
    }
  )
}
