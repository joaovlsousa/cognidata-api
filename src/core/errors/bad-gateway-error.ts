import { HttpError } from './http-error'

export class BadGatewayError extends HttpError {
  constructor(message?: string) {
    super(502, message ?? 'Bad Gateway')
  }
}
