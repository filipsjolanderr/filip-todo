# Better Auth Setup Guide

This project is now configured with Better Auth, PostgreSQL, and Drizzle ORM.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/filip_todo"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:5173"

# Social Providers (optional)
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Database Setup

1. **Install PostgreSQL** if you haven't already:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: Start the PostgreSQL service from Services
   - macOS: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. **Create the database**:
   ```bash
   # Connect to PostgreSQL as the postgres user
   psql -U postgres
   
   # Create the database
   CREATE DATABASE filip_todo;
   
   # Exit psql
   \q
   ```

4. **Run the following commands to set up the database schema**:
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

## Troubleshooting

### Database Connection Issues

If you get connection timeout errors:

1. **Check if PostgreSQL is running**:
   ```bash
   # Windows
   net start postgresql-x64-15
   
   # macOS/Linux
   sudo systemctl status postgresql
   ```

2. **Verify your connection string**:
   - Default: `postgresql://postgres:password@localhost:5432/filip_todo`
   - Update username/password if different
   - Make sure the database `filip_todo` exists

3. **Test connection manually**:
   ```bash
   psql -U postgres -d filip_todo -h localhost
   ```

### Import Path Issues

The project uses the `~/*` path alias (not `@/*`). Make sure all imports use:
```tsx
import { Component } from '~/components/ui/component';
```

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
import { LoginForm, SignUpForm } from '~/components/auth';
import { useUser } from '~/hooks/useAuth';

// In your component
const { user, isAuthenticated, isLoading } = useUser();
```

## Database Schema

The following tables are created:

- `users` - User accounts (managed by Better Auth)
- `todos` - Todo items
- `categories` - Todo categories
- `todo_categories` - Junction table for todo-category relationships 