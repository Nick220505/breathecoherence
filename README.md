# Geometry E-commerce

A modern e-commerce platform built with Next.js 15, featuring a sleek design system and powerful backend integration.

## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 15 and React 19
- **Authentication**: Secure user authentication with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI primitives with custom styling
- **AI Integration**: Google's Gemini AI for enhanced features
- **Image Management**: Cloudinary integration for media handling
- **Internationalization**: Google Translate API support
- **Theme Support**: Dark/Light mode with next-themes
- **Form Handling**: React Hook Form with Zod validation
- **Payment Processing**:
  - Stripe integration for card payments
  - PayPal integration for alternative payment methods
- **Email Service**: Resend for transactional emails
- **Database Hosting**: Neon.tech for PostgreSQL
- **Security**: Environment variable protection and SSL enabled connections

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (we use Neon.tech)
- Cloudinary account
- Google API keys for Gemini and Translate

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/geometry-ecommerce.git
cd geometry-ecommerce
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
GEMINI_API_KEY=your_key
GOOGLE_TRANSLATE_API_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_sender_email
COMPANY_NAME=your_company_name
```

4. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🛠️ Development

### Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack Details

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (Neon.tech)
- **Authentication**: NextAuth.js v5 Beta
- **UI Components**: Radix UI, custom components
- **Styling**: TailwindCSS with custom animations
- **Form Management**: React Hook Form, Zod
- **Media**: Cloudinary integration
- **AI Features**: Google Gemini AI
- **Type Safety**: TypeScript
- **Payment Processing**: Stripe, PayPal
- **Email Service**: Resend

## 📚 Project Structure

```
geometry-ecommerce/
├── actions/              # Server actions for data mutations
├── app/                  # Next.js 15 app directory
│   ├── (admin)/         # Admin dashboard routes
│   ├── (auth)/          # Authentication routes
│   ├── product/         # Product pages
│   └── store/           # Store pages
├── lib/                 # Utility functions and configurations
│   └── schemas/         # Zod validation schemas
├── prisma/              # Database schema and migrations
│   └── migrations/      # Database migration files
├── public/              # Static assets
│   ├── images/          # Image assets
│   └── products/        # Product-related assets
└── styles/              # Global styles and Tailwind config
```

## 🔐 Security

- Secure authentication with NextAuth.js
- Environment variables for sensitive data
- API key protection
- Database connection pooling
- SSL enabled database connections
- Secure payment processing with Stripe and PayPal
- Email verification system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Juan Nicolas Pardo Torres - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Neon.tech for the database service
- Cloudinary for media management
- Google for AI and translation services
