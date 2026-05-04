import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleContactsRepository } from '@/database/drizzle/repositories/drizzle-contacts-repository'
import { filtersContactsDto } from '@/dtos/contacts/filters-contacts-dto'
import { getContactsDto } from '@/dtos/contacts/get-contacts-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { ContactsService } from '@/services/contacts-service'

export const getContactsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/contacts',
    {
      schema: {
        summary: 'Get All Contacts',
        description: '',
        tags: ['Contacts'],
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
      await request.isMasterCurrentUser()
      const filters = request.query

      const contactsService = new ContactsService(
        new DrizzleContactsRepository()
      )
      const { contacts } = await contactsService.getAll(filters)

      return reply.status(200).send({
        contacts,
      })
    }
  )
}
