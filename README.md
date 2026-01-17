# EmbedPath - IF MAGIC Learning Platform

A modern, interactive learning platform for embedded programming with IF MAGIC hardware modules.

## 🚀 Features

- **Learning Roadmap**: Structured track through 20 IF MAGIC modules
- **Interactive Lessons**: Video tutorials, code examples, and hands-on exercises
- **Note Taking**: Built-in notes for each lesson with full persistence
- **Visual Project Editor**: Drag-and-drop interface for designing hardware projects
- **Progress Tracking**: Monitor your learning journey with stats and achievements
- **User Levels**: Adaptive content for Beginner, Intermediate, and Advanced learners

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router
- TypeScript
- Bun runtime

### Backend
- Hono (lightweight web framework)
- Supabase (PostgreSQL database)
- Bun runtime
- TypeScript

## 📦 Installation

### Prerequisites
- [Bun](https://bun.sh) installed
- [Supabase](https://supabase.com) account
- Node.js 18+ (if not using Bun)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cruzhacks-26
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   bun install
   
   # Frontend
   cd ../frontend/HardwareHub
   bun install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `backend/supabase-schema.sql`
   - Get your project URL and keys from Project Settings → API

4. **Configure environment variables**
   
   Backend (`backend/.env`):
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```
   
   Frontend (`frontend/HardwareHub/.env`):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3000
   ```

5. **Run the development servers**
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   bun run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd frontend/HardwareHub
   bun run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/HardwareHub/README.md)
- [IF MAGIC Documentation](https://docs.ifmagic.io)

## 🗂️ Project Structure

```
cruzhacks-26/
├── backend/                    # Hono API server
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── lib/               # Supabase client
│   │   └── types/             # TypeScript types
│   ├── supabase-schema.sql    # Database schema
│   └── package.json
├── frontend/HardwareHub/       # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # API client
│   │   └── data/              # Static data
│   └── package.json
└── README.md
```

## 🔑 Key Integrations

- **IF MAGIC Hardware**: Platform content focuses on 20 IF MAGIC modules
- **Supabase**: Database for users, lessons, progress, notes, and projects
- **Hono**: Lightweight, fast backend API framework

## 📖 API Endpoints

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson

### Progress
- `GET /api/progress/user/:userId` - Get user progress
- `POST /api/progress/complete` - Mark lesson complete

### Notes
- `GET /api/notes/user/:userId` - Get user notes
- `POST /api/notes/save` - Save/update notes

### Projects
- `GET /api/projects/user/:userId` - Get user projects
- `POST /api/projects` - Create new project

### Users
- `GET /api/users/:userId` - Get user profile
- `POST /api/users` - Create new user

See [Backend README](./backend/README.md) for full API documentation.

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend/HardwareHub
vercel
```

### Backend (Vercel/Cloudflare Workers)
```bash
cd backend
vercel
```

## 🤝 Contributing

This project was built for CruzHacks 2026. Contributions, issues, and feature requests are welcome!

## 📝 License

MIT

## 🙏 Acknowledgments

- IF MAGIC for hardware documentation and inspiration
- CruzHacks 2026 organizers
- Supabase for database infrastructure
