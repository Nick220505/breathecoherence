import { Tailwind, Img } from '@react-email/components';

import { emailTailwindConfig } from '@/lib/email-tailwind-config';

interface VerificationEmailProps {
  verificationCode: string;
  companyName: string;
}

export function VerificationEmail({
  verificationCode,
  companyName,
}: Readonly<VerificationEmailProps>) {
  return (
    <Tailwind config={emailTailwindConfig}>
      <div className="mx-auto max-w-[600px] font-sans">
        <div className="mb-6 text-center">
          <Img
            src="https://www.breathecoherence.com/images/BC-logo-transp-120.png"
            alt={companyName}
            width="120"
            height="120"
            className="inline-block h-auto max-w-full"
          />
        </div>
        <h1 className="text-center text-gray-800">Welcome to {companyName}</h1>
        <p className="text-gray-600">
          Thank you for registering. Please use the following code to verify
          your email address:
        </p>
        <div className="my-6 rounded-lg bg-gray-100 p-6 text-center">
          <h2 className="m-0 text-3xl tracking-[4px] text-gray-800">
            {verificationCode}
          </h2>
        </div>
        <p className="text-gray-600">This code will expire in 30 minutes.</p>
        <p className="text-sm text-gray-600">
          If you did not request this verification, please ignore this email.
        </p>
        <div className="mt-6 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </Tailwind>
  );
}
