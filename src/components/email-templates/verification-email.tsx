interface VerificationEmailProps {
  verificationCode: string;
  companyName: string;
  baseUrl: string;
}

export const VerificationEmail = ({
  verificationCode,
  companyName,
  baseUrl,
}: VerificationEmailProps) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
    }}
  >
    <div
      style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${baseUrl}/BC-logo-transp-120.png`}
        alt={companyName}
        width={120}
        height={120}
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
    <h1
      style={{
        color: '#333',
        textAlign: 'center',
      }}
    >
      Welcome to {companyName}
    </h1>
    <p
      style={{
        color: '#666',
      }}
    >
      Thank you for registering. Please use the following code to verify your
      email address:
    </p>
    <div
      style={{
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '24px',
        margin: '24px 0',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: '32px',
          letterSpacing: '4px',
          color: '#333',
          margin: '0',
        }}
      >
        {verificationCode}
      </h2>
    </div>
    <p
      style={{
        color: '#666',
      }}
    >
      This code will expire in 30 minutes.
    </p>
    <p
      style={{
        color: '#666',
        fontSize: '14px',
      }}
    >
      If you did not request this verification, please ignore this email.
    </p>
    <div
      style={{
        textAlign: 'center',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #eee',
        fontSize: '12px',
        color: '#999',
      }}
    >
      © {new Date().getFullYear()} {companyName}. All rights reserved.
    </div>
  </div>
);
