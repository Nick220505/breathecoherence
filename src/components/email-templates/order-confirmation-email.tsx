import * as React from 'react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: ShippingAddress;
  baseUrl: string;
}

export const OrderConfirmationEmail: React.FC<
  Readonly<OrderConfirmationEmailProps>
> = ({ orderId, customerName, items, total, shippingAddress, baseUrl }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${baseUrl}/BC-logo-transp-120.png`}
          alt="Breathe Coherence"
          width="120"
          height="120"
          style={styles.logo}
        />
      </div>
      <h1 style={styles.title}>Order Confirmation</h1>
      <p style={styles.text}>Dear {customerName},</p>
      <p style={styles.text}>
        Thank you for your order! We&apos;re pleased to confirm that your order
        has been received and is being processed.
      </p>

      <div style={styles.orderBox}>
        <h2 style={styles.orderTitle}>Order #{orderId}</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeaderLeft}>Product</th>
              <th style={styles.tableHeaderCenter}>Qty</th>
              <th style={styles.tableHeaderRight}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{item.name}</td>
                <td style={styles.tableCellCenter}>{item.quantity}</td>
                <td style={styles.tableCellRight}>
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={styles.totalLabelCell}>
                Total:
              </td>
              <td style={styles.totalValueCell}>${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {shippingAddress && (
          <div style={styles.shippingContainer}>
            <h3 style={styles.shippingTitle}>Shipping Address:</h3>
            <p style={styles.shippingAddress}>
              {shippingAddress.address}
              <br />
              {shippingAddress.city}, {shippingAddress.state}{' '}
              {shippingAddress.zipCode}
            </p>
          </div>
        )}
      </div>

      <p style={styles.text}>
        You can view your order status and history by visiting your account
        page.
      </p>
      <p style={styles.text}>Thank you for shopping with us!</p>

      <div style={styles.footer}>
        © {new Date().getFullYear()} Breathe Coherence. All rights reserved.
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  logo: {
    display: 'inline-block',
    maxWidth: '100%',
    height: 'auto',
  },
  title: {
    color: '#333',
    textAlign: 'center' as const,
  },
  text: {
    color: '#666',
  },
  orderBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
  },
  orderTitle: {
    fontSize: '18px',
    color: '#333',
    marginTop: '0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeaderLeft: {
    textAlign: 'left' as const,
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  tableHeaderCenter: {
    textAlign: 'center' as const,
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  tableHeaderRight: {
    textAlign: 'right' as const,
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  tableCellCenter: {
    textAlign: 'center' as const,
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  tableCellRight: {
    textAlign: 'right' as const,
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  totalLabelCell: {
    textAlign: 'right' as const,
    padding: '8px 0',
    fontWeight: 'bold',
  },
  totalValueCell: {
    textAlign: 'right' as const,
    padding: '8px 0',
    fontWeight: 'bold',
  },
  shippingContainer: {
    marginTop: '24px',
  },
  shippingTitle: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '8px',
  },
  shippingAddress: {
    margin: '0',
    color: '#666',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #eee',
    fontSize: '12px',
    color: '#999',
  },
};

export default OrderConfirmationEmail;
