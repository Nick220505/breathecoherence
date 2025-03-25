import { VerificationEmail } from '@/components/email-templates/verification-email';
import { CreateEmailResponseSuccess, Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

if (!process.env.EMAIL_FROM) {
  throw new Error('Missing EMAIL_FROM environment variable');
}

if (!process.env.COMPANY_NAME) {
  throw new Error('Missing COMPANY_NAME environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM;
const COMPANY_NAME = process.env.COMPANY_NAME;

export async function sendVerificationEmail(
  email: string,
  verificationCode: string,
): Promise<CreateEmailResponseSuccess | null> {
  const { data, error } = await resend.emails.send({
    from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: 'Verify your email address',
    react: VerificationEmail({ verificationCode, companyName: COMPANY_NAME }),
  });

  if (error) {
    throw new Error('Failed to send verification email');
  }

  return data;
}
