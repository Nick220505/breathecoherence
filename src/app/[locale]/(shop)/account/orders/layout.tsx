'use client';

export default function OrdersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="orders-container">{children}</div>;
}
