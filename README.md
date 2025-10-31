# Post Management Application

A full-stack web application demonstrating authentication and CRUD operations for posts, implemented using multiple technology stacks.

## Features

### Authentication
- Sign Up - Create a new user account
- Sign In - Authenticate with email and password
- Sign Out - End user session

### Post Management (CRUD)
- **List Posts** - View all posts with pagination
- **View Post** - See detailed post information
- **Create Post** - Add new posts
- **Edit Post** - Update existing posts (owner only)
- **Delete Post** - Remove posts (owner only)

## Technology Stacks

This repository contains implementations using:

1. **Next.js** (App Router) - `/nextjs`
2. **Laravel** (API) - `/laravel`

Both implementations use:
- **Supabase** for database and authentication
- **DaisyUI** for UI components (Next.js)
- **PostgreSQL** database

## Project Structure

```
.
├── nextjs/          # Next.js implementation with App Router
│   ├── app/         # Next.js pages and layouts
│   ├── components/  # React components (UI library)
│   ├── lib/         # Utilities and Supabase client
│   └── scripts/     # Database initialization SQL
│
├── laravel/         # Laravel API implementation
│   ├── app/         # Controllers and Models
│   ├── routes/      # API routes
│   └── README.md    # Laravel-specific setup instructions
│
└── README.md        # This file
```

---

## Setup Instructions

### Prerequisites

For all implementations:
- Node.js 18+ (for Next.js)
- PHP 8.1+ and Composer (for Laravel)
- A Supabase account and project

### Supabase Setup

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your project credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key (for migrations)

4. Run the database initialization SQL:
   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `nextjs/scripts/init-db.sql`

---

## Next.js Setup

### Installation

```bash
cd nextjs
npm install
```

### Environment Configuration

Create a `.env.local` file in the `nextjs` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

### Next.js Features

- **Framework**: Next.js 13 with App Router
- **Authentication**: Supabase Auth with email/password
- **Database**: Supabase PostgreSQL with Row Level Security
- **UI Library**: DaisyUI (Tailwind CSS components)
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript

---

## Laravel Setup

### Installation

```bash
cd laravel
composer install
```

### Environment Configuration

Create a `.env` file in the `laravel` directory:

```env
APP_NAME=PostManagementAPI
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_database_password

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

Generate application key:
```bash
php artisan key:generate
```

### Running the Application

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Laravel API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive access token
- `POST /api/auth/logout` - Logout (requires authentication)

#### Posts (All require authentication)
- `GET /api/posts` - List all posts (paginated)
- `GET /api/posts/{id}` - Get a single post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

### Laravel Features

- **Framework**: Laravel 10
- **Authentication**: Laravel Sanctum for API tokens
- **Database**: PostgreSQL via Supabase
- **API**: RESTful API with JSON responses
- **Validation**: Built-in Laravel validation

---

## Docker Compose (Bonus)

A `docker-compose.yml` file is provided to run all stacks together:

```yaml
version: '3.8'

services:
  nextjs:
    build: ./nextjs
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    volumes:
      - ./nextjs:/app
      - /app/node_modules

  laravel:
    build: ./laravel
    ports:
      - "8000:8000"
    environment:
      - DB_CONNECTION=pgsql
      - DB_HOST=${DB_HOST}
      - DB_PORT=5432
      - DB_DATABASE=postgres
      - DB_USERNAME=postgres
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - ./laravel:/var/www/html
```

To run with Docker Compose:

```bash
# Create a .env file at the root with your credentials
docker-compose up -d
```

---

## Database Schema

### Posts Table

```sql
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Row Level Security Policies

- **SELECT**: Authenticated users can view all posts
- **INSERT**: Authenticated users can create posts (user_id must match)
- **UPDATE**: Users can only update their own posts
- **DELETE**: Users can only delete their own posts

---

## Testing the Application

### Next.js Testing Flow

1. Visit `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Sign in with your credentials
4. Create a new post
5. View, edit, and delete your posts
6. Test pagination with multiple posts

### Laravel API Testing

Using curl or Postman:

1. **Register**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Create Post** (use token from login):
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My First Post","content":"This is the content"}'
```

---

## Technical Notes

### Why These Stacks?

- **Next.js**: Modern React framework with server-side rendering, API routes, and excellent developer experience
- **Laravel**: Mature PHP framework with robust ORM, authentication, and API capabilities

### Design Choices

- **Supabase**: Provides PostgreSQL database, authentication, and real-time capabilities in one platform
- **DaisyUI**: Provides beautiful, accessible components with minimal custom CSS
- **Row Level Security**: Database-level security ensures data protection even if application logic fails
- **Pagination**: Implemented for better performance with large datasets

### Security Considerations

- Passwords are hashed (Supabase handles this automatically)
- Row Level Security prevents unauthorized access
- Authentication tokens are required for all post operations
- CORS is configured appropriately
- Input validation on both client and server

---

## License

MIT

---

## Author

Built as a technical assessment demonstrating full-stack development capabilities across multiple frameworks.
