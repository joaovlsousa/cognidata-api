import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '@/config/env'
import { errorHandler } from './error-handler'
import { authenticateWithEmailAndPasswordRoute } from './routes/auth/authenticate-with-email-and-password-route'
import { createContactRoute } from './routes/contacts/create-contact-route'
import { createAdminUserRoute } from './routes/users/create-admin-user-route'
import { createApplicatorUserRoute } from './routes/users/create-applicator-user-route'
import { createMasterUserRoute } from './routes/users/create-master-user-route'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setErrorHandler(errorHandler)
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
server.register(fastifyCors, {
  origin: env.CLIENT_APP_URL,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
})

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Psicho Hub API',
      description:
        'API para gerenciamento e análise de dados psicológicos de pacientes e alunos.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
server.register(ScalarApiReference, {
  routePrefix: '/docs',
})

// Auth routes
server.register(authenticateWithEmailAndPasswordRoute)

// User routes
server.register(createMasterUserRoute)
server.register(createAdminUserRoute)
server.register(createApplicatorUserRoute)

// Contact routes
server.register(createContactRoute)

server
  .listen({
    port: env.PORT,
    host: env.HOST,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`)
    console.log(`Docs available at http://localhost:${env.PORT}/docs`)
  })
