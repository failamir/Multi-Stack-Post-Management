# Laravel API Backend

This is a Laravel API backend for the Post Management application.

## Prerequisites

- PHP >= 8.1
- Composer
- PostgreSQL

## Installation

1. Install Laravel via Composer:
```bash
cd laravel
composer create-project laravel/laravel .
```

2. Install Supabase PHP client:
```bash
composer require supabase-community/supabase-php
```

3. Configure environment variables in `.env`:
```
DB_CONNECTION=pgsql
DB_HOST=db.jsmewescgnvfbevdnuqx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_password

SUPABASE_URL=https://jsmewescgnvfbevdnuqx.supabase.co
SUPABASE_KEY=your_anon_key
```

4. Run migrations (the posts table should already exist from Next.js setup)

5. Start the server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/{id}` - Get a single post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

All post endpoints require authentication.
