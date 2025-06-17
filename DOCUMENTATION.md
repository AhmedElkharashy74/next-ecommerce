# Next.js E-commerce MVP Documentation

## Project Overview
This is a modern e-commerce MVP (Minimum Viable Product) built with Next.js 14, featuring a robust tech stack and modern development practices. The project implements a full-featured e-commerce platform with secure payment processing, user authentication, and email notifications.

## Tech Stack
- **Framework**: Next.js 14.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
- **Payment Processing**: Stripe
- **Email Service**: React Email with Resend
- **UI Components**: Radix UI
- **Form Validation**: Zod

## Project Structure
```
src/
├── actions/     # Server actions and API endpoints
├── app/         # Next.js app router pages and layouts
├── components/  # Reusable UI components
├── db/          # Database configuration and models
├── email/       # Email templates
├── lib/         # Utility functions and shared logic
└── middleware.ts # Next.js middleware for request handling
```

## Key Features
1. **Modern Architecture**
   - Next.js App Router
   - Server Components
   - TypeScript for type safety
   - Tailwind CSS for styling

2. **E-commerce Features**
   - Product catalog
   - Shopping cart functionality
   - Secure checkout process
   - Order management

3. **Payment Integration**
   - Stripe payment processing
   - Secure payment handling
   - Payment status tracking

4. **Email System**
   - Order confirmation emails
   - Transaction notifications
   - Custom email templates using React Email

5. **User Experience**
   - Responsive design
   - Modern UI components
   - Smooth animations
   - Accessible interface

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn
- Stripe account for payment processing
- Resend account for email services

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=your_database_url
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Development
Run the development server:
```bash
npm run dev
```
The application will be available at http://localhost:3000

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run email` - Start email development server

## Database Schema
The project uses Prisma as its ORM. The database schema is defined in the `prisma/schema.prisma` file.

## API Routes
The project uses Next.js API routes and Server Actions for backend functionality. All API endpoints are located in the `src/actions` directory.

## Deployment
The application can be deployed on Vercel or any other platform that supports Next.js applications.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the terms included in the LICENSE file.

## Support
For support, please open an issue in the repository or contact the development team. 