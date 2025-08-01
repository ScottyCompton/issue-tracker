# Issue Tracker

A modern, full-stack issue tracking application built with Next.js, featuring issue management, user authentication, and comprehensive project oversight capabilities.

## 📋 Summary

The Issue Tracker is a comprehensive project management tool designed to help teams efficiently track, manage, and resolve issues throughout their development lifecycle. Built with modern web technologies, it provides an intuitive interface for creating, updating, and monitoring project issues with detailed analytics and flexible deployment options.

## 🎯 Purpose

This application serves as a centralized platform for:

- **Issue Management**: Create, edit, and track project issues with detailed descriptions and status updates
- **Team Collaboration**: Assign issues to team members and track progress
- **Project Analytics**: Visualize issue distribution and project health through interactive charts
- **Workflow Optimization**: Streamline development processes with status-based filtering and sorting
- **Dashboard Overview**: Monitor project status with comprehensive issue summaries

## ✨ Features

### Core Functionality

- **Issue Creation & Management**: Create, edit, and delete issues with rich text descriptions
- **Status Tracking**: Monitor issues through OPEN, IN_PROGRESS, and CLOSED statuses
- **User Assignment**: Assign issues to team members for accountability
- **Real-time Dashboard**: View project overview with issue summaries and charts
- **Advanced Filtering**: Filter issues by status, assignee, and date ranges
- **Pagination**: Handle large issue lists with efficient pagination

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Radix UI components
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Form Validation**: Client and server-side validation with helpful feedback

### Technical Features

- **Authentication**: Secure user authentication with NextAuth.js
- **GraphQL API**: Efficient data fetching with Apollo GraphQL
- **Database**: MySQL database with Prisma ORM for type-safe queries
- **Environment Configuration**: Flexible deployment with environment variables
- **Testing**: Comprehensive test suite with Vitest and React Testing Library

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **React Hook Form**: Form handling and validation
- **React Query**: Server state management
- **Recharts**: Data visualization

### Backend

- **GraphQL**: API layer with Apollo Server
- **Prisma**: Database ORM
- **MySQL**: Primary database
- **NextAuth.js**: Authentication provider
- **Zod**: Schema validation

### Development Tools

- **Vitest**: Unit and integration testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **React Testing Library**: Component testing

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MySQL** database server
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd issue-tracker
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
APP_PUBLIC_URL="http://localhost:3000"

# Database
DATABASE_URL="mysql://username:password@localhost:3306/issue_tracker"

# Authentication (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Step 4: Database Setup

1. **Create Database**: Create a MySQL database named `issue_tracker`

```sql
CREATE DATABASE issue_tracker;
```

2. **Run Migrations**: Apply database schema

```bash
npx prisma migrate dev
```

3. **Generate Prisma Client**: Generate the database client

```bash
npx prisma generate
```

### Step 5: Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open the application URL (default: http://localhost:3000) in your browser to view the application.

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/app/components/Navbar.spec.tsx
```

### Test Coverage Goals

- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run tests
npm run coverage     # Run tests with coverage
npm run coverage:html # Run tests with HTML coverage report

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Database
npx prisma migrate dev    # Run database migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio
```

## 🏗️ Project Structure

```
issue-tracker/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # Shared components
│   ├── issues/           # Issue management pages
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── lib/              # Utility functions
│   └── auth/             # Authentication configuration
├── prisma/               # Database schema and migrations
├── tests/                # Test files (mirrors app structure)
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔧 Configuration

### Database Configuration

The application uses Prisma with MySQL. Update the `DATABASE_URL` in your `.env.local` file to point to your MySQL instance.

### Authentication Setup

Configure authentication providers in `app/auth/authOptions.ts`. The application supports:

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Custom authentication flows

### Environment Configuration

The application uses environment variables for flexible deployment. The `APP_PUBLIC_URL` variable controls the API endpoint, making it easy to deploy to different environments.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Configure build settings for Next.js
- **Railway**: Deploy with automatic database provisioning
- **AWS/Google Cloud**: Use container deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the test files for usage examples

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
