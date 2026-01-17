# EmbedPath Backend

Backend API server for the EmbedPath learning platform, built with Hono and Supabase.

## Tech Stack

- **Framework**: Hono (lightweight web framework)
- **Runtime**: Bun
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Setup

### 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the SQL from `supabase-schema.sql` to create all tables
4. Get your project URL and keys from Project Settings → API

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 5. Run Development Server

```bash
bun run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /` - Server health check

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `GET /api/lessons/category/:category` - Get lessons by category
- `GET /api/lessons/module/:module` - Get lessons by module
- `POST /api/lessons` - Create new lesson
- `PUT /api/lessons/:id` - Update lesson

### Progress
- `GET /api/progress/user/:userId` - Get all progress for user
- `GET /api/progress/user/:userId/lesson/:lessonId` - Get progress for specific lesson
- `POST /api/progress/complete` - Mark lesson as complete
- `GET /api/progress/stats/:userId` - Get user progress stats

### Notes
- `GET /api/notes/user/:userId` - Get all notes for user
- `GET /api/notes/user/:userId/lesson/:lessonId` - Get notes for specific lesson
- `POST /api/notes/save` - Create or update notes
- `DELETE /api/notes/:noteId` - Delete note

### Users
- `GET /api/users/:userId` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user profile

### Projects
- `GET /api/projects/user/:userId` - Get all projects for user
- `GET /api/projects/:projectId` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── lib/
│   │   └── supabase.ts       # Supabase client setup
│   ├── routes/
│   │   ├── lessons.ts        # Lesson routes
│   │   ├── progress.ts       # Progress routes
│   │   ├── notes.ts          # Notes routes
│   │   ├── users.ts          # User routes
│   │   └── projects.ts       # Project routes
│   └── types/
│       └── database.types.ts # TypeScript database types
├── package.json
├── .env.example
├── supabase-schema.sql       # Database schema
└── README.md
```

## Deployment

### Vercel

1. Install Vercel CLI: `bun install -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Cloudflare Workers

1. Install Wrangler: `bun install -g wrangler`
2. Configure `wrangler.toml`
3. Run: `wrangler publish`

## Development

### Watch Mode

```bash
bun run dev
```

This will automatically restart the server when you make changes.

### Type Generation

To regenerate TypeScript types from your Supabase schema:

```bash
bun run db:generate
```

## License

MIT
