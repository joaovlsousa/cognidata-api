import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleContactsRepository } from '@/database/drizzle/repositories/drizzle-contacts-repository'
import { getContactByIdDto } from '@/dtos/contacts/get-contact-by-id-dto'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { ContactsService } from '@/services/contacts-service'

export const getContactByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/contacts/:id',
    {
      schema: {
        summary: 'Get Contacts By Id',
        description: 'Retrieve a specific contact by ID.',
        tags: ['Contacts'],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: getContactByIdDto,
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware, authorizationMiddleware],
    },
    async (request, reply) => {
      await request.isMasterCurrentUser()
      const { id: contactId } = request.params

      const contactsService = new ContactsService(
        new DrizzleContactsRepository()
      )
      const { contact } = await contactsService.getById(contactId)

      return reply.status(200).send({
        contact,
      })
    }
  )
}
