# EmbedPath Frontend

Frontend application for the EmbedPath learning platform, built with React, Vite, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Package Manager**: Bun (or npm)
- **Runtime**: Bun

## Setup

### 1. Install Bun (Recommended)

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

With Bun:
```bash
bun install
```

Or with npm:
```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

### 4. Run Development Server

With Bun:
```bash
bun run dev
```

Or with npm:
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Project Structure

```
frontend/HardwareHub/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.tsx      # Main layout with header/nav
│   │   └── ModuleIcons.tsx # SVG icons for IF MAGIC modules
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Learning.tsx    # Learning roadmap
│   │   ├── Lesson.tsx      # Individual lesson view
│   │   ├── Notes.tsx       # Notes review page
│   │   ├── Projects.tsx    # Projects hub
│   │   ├── ProjectEditor.tsx # Visual project editor
│   │   ├── Profile.tsx     # User profile
│   │   ├── About.tsx       # About page
│   │   └── Signup.tsx      # User registration
│   ├── data/
│   │   └── lessonData.ts   # Lesson content (mock data)
│   ├── lib/
│   │   └── api.ts          # API client for backend
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## Features

- 🎓 **Learning Roadmap**: Visual track of 20 IF MAGIC module lessons
- 📚 **Lessons**: Individual lesson pages with video, content, and practice exercises
- 📝 **Notes**: Take and review notes for each lesson
- 🎨 **Project Editor**: Visual drag-and-drop interface for creating hardware projects
- 👤 **User Profiles**: Track progress and achievements
- 🎯 **Access Control**: Beginner/Intermediate/Advanced lesson access
- 🌑 **Dark Theme**: Cyberpunk hacker aesthetic

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## Connecting to Backend

The frontend uses the API client (`src/lib/api.ts`) to communicate with the Hono backend.

Make sure:
1. Backend server is running on port 3000
2. `VITE_API_URL` is set correctly in `.env`
3. CORS is configured properly in the backend

## Building for Production

```bash
bun run build
```

The build output will be in the `dist/` folder.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `bun install -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- Cloudflare Pages
- GitHub Pages
- AWS S3 + CloudFront

## License

MIT
