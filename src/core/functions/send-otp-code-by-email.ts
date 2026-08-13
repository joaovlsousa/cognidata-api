import { format } from 'date-fns'
import { Resend } from 'resend'
import { env } from '@/config/env'

const resend = new Resend(env.RESEND_API_KEY)

interface Params {
  code: string
  email: string
  validUntil: Date
}

export async function sendOtpCodeByEmail(params: Params) {
  const formatValidUntil = format(params.validUntil, 'dd/MM/yy HH:mm')

  const response = await resend.emails.send({
    from: `CogniData <noreply@${env.MAIL_DOMAIN}>`,
    to: [params.email],
    subject: 'Seu código de verificação',
    html: `
      <h3>Olá,</h3>
<p>Seu código de verificação é: <strong>${params.code}</strong></p>
<p>Este código expira em: <strong>${formatValidUntil}</strong></p>
<p>Não compartilhe este código com ninguém. Se você não solicitou isso, ignore este e-mail.</p>
<h4>- CogniData</h4>
    `.trim(),
  })

  return response
}
