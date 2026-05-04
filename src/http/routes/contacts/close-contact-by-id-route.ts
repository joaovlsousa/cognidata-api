import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleContactsRepository } from '@/database/drizzle/repositories/drizzle-contacts-repository'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { authorizationMiddleware } from '@/http/middlewares/authorization-middleware'
import { ContactsService } from '@/services/contacts-service'

export const closeContactByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/contacts/:id/close',
    {
      schema: {
        summary: 'Close Contact By Id',
        description: '',
        tags: ['Contacts'],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.void(),
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
      await contactsService.closeById(contactId)

      return reply.status(200).send()
    }
  )
}
