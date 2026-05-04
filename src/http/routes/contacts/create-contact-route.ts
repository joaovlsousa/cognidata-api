import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleContactsRepository } from '@/database/drizzle/repositories/drizzle-contacts-repository'
import { createContactDto } from '@/dtos/contacts/create-contact-dto'
import { ContactsService } from '@/services/contacts-service'

export const createContactRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/contacts',
    {
      schema: {
        summary: 'Create Contact',
        description: 'Create a new contact entry.',
        tags: ['Contacts'],
        body: createContactDto,
        response: {
          201: z.void(),
          400: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const contactDto = request.body

      const contactsService = new ContactsService(
        new DrizzleContactsRepository()
      )
      await contactsService.create(contactDto)

      return reply.status(201).send()
    }
  )
}
