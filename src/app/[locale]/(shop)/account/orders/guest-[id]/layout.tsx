'use client';

export default function GuestOrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="guest-order-container">{children}</div>;
}
