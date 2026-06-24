import 'fastify'

interface GetCurrentUserResponse {
  sub: string
  role: 'admin' | 'applicator'
}

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUser: () => Promise<GetCurrentUserResponse>
    isAdminCurrentUser: () => Promise<void>
    isApplicatorCurrentUser: () => Promise<void>
  }
}
