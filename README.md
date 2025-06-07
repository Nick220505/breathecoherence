<p align="center">
  <img src="public/images/BC-logo-transp-120.png" alt="Breathe Coherence Logo" width="120"/>
</p>
<h1 align="center">Breathe Coherence</h1>

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-15.3-black?logo=next.js" alt="Next.js">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  </a>
  <a href="https://www.prisma.io/">
    <img src="https://img.shields.io/badge/Prisma-6.9-darkblue?logo=prisma" alt="Prisma">
  </a>
  <a href="https://next-intl.dev/">
    <img src="https://img.shields.io/badge/i18n-next--intl-blue.svg" alt="next-intl">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
</p>

A modern e-commerce platform built with Next.js, featuring a sleek design system and powerful backend integration.

## 📋 Table of Contents

- [📋 Table of Contents](#-table-of-contents)
- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation \& Setup](#installation--setup)
- [🔧 Environment Variables](#-environment-variables)
- [📁 Project Structure](#-project-structure)
- [🚀 Deployment](#-deployment)
- [📜 Available Scripts](#-available-scripts)
- [🌐 Browser Compatibility](#-browser-compatibility)
- [🔐 Security](#-security)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👥 Authors](#-authors)
- [🙏 Acknowledgments](#-acknowledgments)

## 🚀 Key Features

- 🔄 **Modern Tech Stack**: Built with the latest Next.js and React.
- 🔒 **Secure Authentication**: Robust user authentication with NextAuth.js v5.
- 🌐 **Internationalization**: Seamless internationalization with `next-intl`, with dynamic translations powered by the DeepL API.
- 🤖 **AI-Powered Chat**: Enhanced user interaction with Google's Gemini AI.
- 💳 **Comprehensive Payments**: Seamless checkout with Stripe and PayPal.
- ✨ **Responsive UI**: Beautiful, accessible components built with Radix UI and Shadcn.
- 📝 **Advanced Form Handling**: Type-safe forms with React Hook Form and Zod.
- 📧 **Transactional Emails**: Reliable email delivery using Resend.

## 🛠️ Tech Stack

- ⚙️ **Framework**: Next.js 15
- 🎨 **UI**: React 19, TailwindCSS, Shadcn UI, Radix UI, Framer Motion
- 🔌 **Backend**: Next.js API Routes
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🔑 **Authentication**: NextAuth.js v5
- 🌍 **Internationalization**: `next-intl`
- 🔄 **Translation**: DeepL API
- 🧠 **AI**: Google Gemini
- 💰 **Payments**: Stripe, PayPal
- 📨 **Emails**: Resend
- 📊 **State Management**: Zustand

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database (we recommend Neon.tech)
- API keys for DeepL, Google Gemini, Stripe, PayPal, and Resend

### Installation & Setup

1.  **Clone the repository:** 📥

    ```bash
    git clone https://github.com/Nick220505/breathecoherence.git
    cd breathecoherence
    ```

2.  **Install dependencies:** 📦

    ```bash
    npm install
    ```

3.  **Set up environment variables:** 🔐

    - Copy the `.env.example` file to a new file named `.env`.
    - Fill in the required API keys and database URLs.

4.  **Initialize the database:** 🛢️

    - This command syncs your Prisma schema with your database.

    ```bash
    npx prisma db push
    ```

5.  **Seed the database:** 🌱

    - This command populates the database with initial data.

    ```bash
    npx prisma db seed
    ```

6.  **Run the development server:** 🚀
    ```bash
    npm run dev
    ```

The application will now be available at `http://localhost:3000`.

## 🔧 Environment Variables

This project requires several environment variables to function properly. Create a `.env` file with the following variables:

```bash
# Company Information
COMPANY_NAME="your_company_name"

# Database Configuration - We use Neon.tech PostgreSQL
POSTGRES_PRISMA_URL="your_postgres_prisma_url"

# Authentication
NEXTAUTH_URL="your_nextauth_url"
NEXTAUTH_SECRET="your_nextauth_secret"

# Email Configuration
EMAIL_FROM="your_email_from"

# API Keys
DEEPL_API_KEY="your_deepl_api_key"
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_GEMINI_API_KEY="your_public_gemini_api_key"

# Payments - Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"

# Payments - PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_SECRET="your_paypal_secret"

# Email - Resend
RESEND_API_KEY="your_resend_api_key"

# Other Services
NEXT_PUBLIC_STACK_PROJECT_ID="your_stack_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_stack_publishable_client_key"
```

## 📁 Project Structure

```
breathecoherence/
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── app/                # Next.js 15 App Router
│   │   ├── [locale]/       # Internationalized routes
│   │   │   ├── (admin)/    # Admin-only routes (e.g., dashboard)
│   │   │   ├── (auth)/     # Auth routes (login, register)
│   │   │   ├── (shop)/     # Main shop routes (store, checkout)
│   │   │   └── page.tsx    # Home page
│   │   ├── api/            # API endpoints
│   │   └── globals.css     # Global styles
│   ├── components/         # Shared React components (UI, email templates)
│   │   └── ui/             # Shadcn UI components
│   ├── features/           # Feature-sliced business logic
│   │   ├── auth/           # Authentication logic and actions
│   │   └── product/        # Product logic, actions, and schemas
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization (i18n) configuration
│   ├── lib/                # Core libraries, utilities, and external service clients
│   │   ├── stores/         # Zustand global state stores
│   │   ├── types/          # Shared TypeScript types
│   │   ├── email.ts        # Resend email client
│   │   ├── gemini.ts       # Google Gemini AI client
│   │   ├── prisma.ts       # Prisma client instance
│   │   ├── translation.ts  # DeepL translation client
│   │   └── utils.ts        # General utility functions
│   ├── messages/           # `next-intl` translation files (en.json, es.json)
│   └── prisma/             # Prisma schema, migrations, and seed script
├── .env.example            # Example environment variables
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Deployment

- **Vercel (Recommended)**:

  ```bash
  vercel
  ```

  For production deployment:

  ```bash
  vercel --prod
  ```

- **Docker**:

  ```bash
  docker build -t breathecoherence .
  docker run -p 3000:3000 breathecoherence
  ```

- **Self-hosted**:
  ```bash
  npm run build
  npm run start
  ```

## 📜 Available Scripts

- 🔥 `npm run dev` - Starts the development server with hot-reloading.
- 📦 `npm run build` - Creates an optimized production build.
- 🚀 `npm run start` - Starts the production server.
- 🔍 `npm run lint` - Lints the codebase for errors and style issues.
- ✨ `npm run format` - Formats all files using Prettier.

## 🌐 Browser Compatibility

- 💻 **Chrome** - Latest version (fully supported)
- 🦊 **Firefox** - Latest version (fully supported)
- 🧭 **Edge** - Latest version (fully supported)
- 🧪 **Safari** - Version 14+ (fully supported)
- 📱 **Mobile browsers** - Modern iOS and Android browsers

## 🔐 Security

- 🛡️ **Authentication**: Secure, session-based authentication using NextAuth.js v5.
- 🔒 **Data Protection**: Environment variables used for all sensitive keys and secrets.
- 💳 **Secure Payments**: PCI-compliant payment processing with Stripe and PayPal.
- 🔐 **Database**: SSL-enabled connections to the PostgreSQL database.
- 🛠️ **API**: Protection against common vulnerabilities.

## 🛠️ Troubleshooting

- ❓ **Database Connection Issues**:

  ```
  Error: P1001: Can't reach database server
  ```

  ✅ **Solution**: Check your database URL in .env file and ensure your IP is allowed in the database firewall settings.

- ❓ **API Keys Not Working**:

  ```
  Error: Authentication failed. Please check your API key
  ```

  ✅ **Solution**: Verify that all API keys in your .env file are correctly formatted and valid.

- ❓ **Build Errors**:

  ```
  Error: Cannot find module '@/components/...'
  ```

  ✅ **Solution**: Run `npm install` to ensure all dependencies are installed, and check for typos in import paths.

- ❓ **Payment Processing Issues**:
  ```
  Error: Your card was declined
  ```
  ✅ **Solution**: In development, use Stripe's test cards (e.g., 4242 4242 4242 4242) with any future expiry date and CVC.

## 🤝 Contributing

1.  🍴 Fork the repository.
2.  🌿 Create your feature branch (`git checkout -b feature/your-amazing-feature`).
3.  💾 Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  📤 Push to the branch (`git push origin feature/your-amazing-feature`).
5.  🔍 Open a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Juan Nicolas Pardo Torres - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Neon.tech for the database service
- Google for AI services
- DeepL for translation services
