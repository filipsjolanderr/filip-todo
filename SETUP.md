# Better Auth Setup Guide

This project is now configured with Better Auth, PostgreSQL, and Drizzle ORM.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/filip_todo"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:5173"

# Social Providers (optional)
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Database Setup

1. Make sure PostgreSQL is running and create a database named `filip_todo`
2. Run the following commands to set up the database schema:

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Better Auth Setup

1. Generate a secure secret key for Better Auth:
   ```bash
   openssl rand -base64 32
   ```

2. Add the generated key to your `.env` file as `BETTER_AUTH_SECRET`

3. The auth routes are already configured at `/api/auth/*`

## Available Scripts

- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Authentication Components

The following components are available in `src/components/auth/`:

- `LoginForm` - User login form
- `SignUpForm` - User registration form

## API Routes

- `/api/auth/*` - Better Auth endpoints
- `/api/me` - Get current user information

## Usage

Import the auth components and hooks:

```tsx
import { LoginForm, SignUpForm } from '@/components/auth';
import { useUser } from '@/hooks/useAuth';

// In your component
const { user, isAuthenticated, isLoading } = useUser();
```

## Database Schema

The following tables are created:

- `users` - User accounts (managed by Better Auth)
- `todos` - Todo items
- `categories` - Todo categories
- `todo_categories` - Junction table for todo-category relationships 