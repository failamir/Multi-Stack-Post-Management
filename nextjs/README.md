# Next.js Post Management Application

A modern full-stack post management application built with Next.js 13 App Router, Supabase, and DaisyUI.

## Features

- User authentication (sign up, sign in, sign out)
- CRUD operations for posts
- Pagination for post listings
- Row Level Security for data protection
- Responsive UI with DaisyUI components

## Tech Stack

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth)
- **DaisyUI** - Tailwind CSS component library
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js 18 or higher
- A Supabase account and project

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root of the nextjs directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Initialize the database:

Go to your Supabase project dashboard, open the SQL Editor, and run the SQL script from `scripts/init-db.sql`.

This will create:
- The `posts` table
- Row Level Security policies
- Necessary indexes

## Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

Type checking:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nextjs/
├── app/
│   ├── auth/
│   │   ├── signin/      # Sign in page
│   │   └── signup/      # Sign up page
│   ├── posts/
│   │   ├── [id]/
│   │   │   ├── edit/    # Edit post page
│   │   │   └── page.tsx # View post page
│   │   ├── create/      # Create post page
│   │   └── page.tsx     # Posts listing page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout with AuthProvider
│   └── page.tsx         # Home page
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth-context.tsx # Authentication context
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
├── scripts/
│   └── init-db.sql      # Database initialization script
└── public/              # Static assets
```

## Usage

### Sign Up
1. Visit the home page
2. Click "Sign Up"
3. Enter your email and password (minimum 6 characters)
4. Account will be created and you'll be redirected to sign in

### Sign In
1. Click "Sign In" from the home page
2. Enter your credentials
3. You'll be redirected to the posts page

### Create a Post
1. After signing in, click "Create Post"
2. Enter a title and content
3. Click "Create Post"

### View Posts
- All posts are displayed on the posts page
- Click "View" to see full post details
- Pagination controls appear when there are more than 10 posts

### Edit a Post
- You can only edit posts you created
- Click "Edit" on your post
- Make changes and click "Save Changes"

### Delete a Post
- You can only delete posts you created
- Click "Delete" and confirm the action

## Authentication

This application uses Supabase Authentication with:
- Email/password authentication
- Session management
- Protected routes

Authentication state is managed through a React Context (`AuthProvider`) that wraps the entire application.

## Database Schema

### Posts Table
- `id` (UUID) - Primary key
- `title` (TEXT) - Post title
- `content` (TEXT) - Post content
- `user_id` (UUID) - Foreign key to auth.users
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

### Row Level Security Policies
- **SELECT**: Authenticated users can view all posts
- **INSERT**: Authenticated users can create posts
- **UPDATE**: Users can only update their own posts
- **DELETE**: Users can only delete their own posts

## UI Components

This project uses DaisyUI for UI components, which provides:
- Cards
- Buttons
- Forms
- Inputs
- Alerts
- Navigation
- Pagination

All components follow DaisyUI's design system for consistency.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Troubleshooting

### "Invalid token" or authentication errors
- Make sure your Supabase environment variables are correct
- Check that the Supabase project is active

### Posts not appearing
- Ensure you've run the database initialization SQL
- Check that Row Level Security policies are enabled
- Verify you're signed in

### Build errors
- Run `npm run typecheck` to identify TypeScript errors
- Ensure all dependencies are installed with `npm install`

## License

MIT
