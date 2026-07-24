import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { origin } from '@/config/cors'
import { env } from '@/config/env'
import { errorHandler } from './error-handler'
import { authenticateWithEmailAndPasswordRoute } from './routes/auth/authenticate-with-email-and-password-route'
import { generateOtpCodeRoute } from './routes/auth/generate-otp-code-route'
import { resetPasswordRoute } from './routes/auth/reset-password-route'
import { verifyOtpCodeRoute } from './routes/auth/verify-otp-code-route'
import { closeContactByIdRoute } from './routes/contacts/close-contact-by-id-route'
import { createContactRoute } from './routes/contacts/create-contact-route'
import { getContactByIdRoute } from './routes/contacts/get-contact-by-id-route'
import { getContactsRoute } from './routes/contacts/get-contacts-route'
import { createPatientRoute } from './routes/patients/create-patient-route'
import { createPatientsFromCsvRoute } from './routes/patients/create-patients-from-csv-route'
import { deletePatientByIdRoute } from './routes/patients/delete-patient-by-id-route'
import { editPatientRoute } from './routes/patients/edit-patient-route'
import { getPatientsByApplicatorIdRoute } from './routes/patients/get-all-patients-by-applicator-id-route'
import { getPatientByIdRoute } from './routes/patients/get-patient-by-id-route'
import { getTotalOfPatientsByApplicatorIdRoute } from './routes/patients/get-total-of-patients-by-applicator-id-route'
import { healthCheckRoute } from './routes/public/health-check-route'
import { createSessionItemRoute } from './routes/session-items/create-session-item-route'
import { createSessionRoute } from './routes/sessions/create-session-route'
import { activateUserRoute } from './routes/users/activate-user-route'
import { createAdminUserRoute } from './routes/users/create-admin-user-route'
import { createApplicatorUserRoute } from './routes/users/create-applicator-user-route'
import { getInactiveUsersRoute } from './routes/users/get-inactive-users-route'
import { getProfileRoute } from './routes/users/get-profile-route'
import { updateApplicatorUserRoute } from './routes/users/update-applicator-user-route'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setErrorHandler(errorHandler)
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

server.register(fastifyCors, {
  origin,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
})

server.register(fastifyMultipart)

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Psico Hub API',
      description:
        'API para gerenciamento e análise de dados psicológicos de pacientes e alunos.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
server.register(ScalarApiReference, {
  routePrefix: '/docs',
})

// Public routes
server.register(healthCheckRoute)

// Auth routes
server.register(authenticateWithEmailAndPasswordRoute)
server.register(generateOtpCodeRoute)
server.register(verifyOtpCodeRoute)
server.register(resetPasswordRoute)

// User routes
server.register(getProfileRoute)
server.register(getInactiveUsersRoute)
server.register(createAdminUserRoute)
server.register(createApplicatorUserRoute)
server.register(activateUserRoute)
server.register(updateApplicatorUserRoute)

// Patient routes
server.register(createPatientRoute)
server.register(createPatientsFromCsvRoute)
server.register(editPatientRoute)
server.register(getPatientsByApplicatorIdRoute)
server.register(getTotalOfPatientsByApplicatorIdRoute)
server.register(getPatientByIdRoute)
server.register(deletePatientByIdRoute)

// Session routes
server.register(createSessionRoute)
server.register(createSessionItemRoute)

// Contact routes
server.register(createContactRoute)
server.register(closeContactByIdRoute)
server.register(getContactByIdRoute)
server.register(getContactsRoute)

server
  .listen({
    port: env.PORT,
    host: env.HOST,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`)
    console.log(`Docs available at http://localhost:${env.PORT}/docs`)
  })
