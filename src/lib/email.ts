import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

if (!process.env.EMAIL_FROM) {
  throw new Error('Missing EMAIL_FROM environment variable');
}

if (!process.env.COMPANY_NAME) {
  throw new Error('Missing COMPANY_NAME environment variable');
}

const globalForResend = global as unknown as {
  resend: Resend;
};

const resend = globalForResend.resend ?? new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== 'production') globalForResend.resend = resend;

export const FROM_EMAIL = process.env.EMAIL_FROM;
export const COMPANY_NAME = process.env.COMPANY_NAME;

export default resend;
