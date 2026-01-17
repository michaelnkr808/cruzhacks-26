# EmbedPath Setup Guide

Complete setup instructions for the EmbedPath learning platform.

## Quick Start

Run the automated setup script:

```bash
./setup.sh
```

This will:
- ✅ Install Bun (if not installed)
- ✅ Install all dependencies for backend and frontend
- ✅ Create `.env` files from examples

## Manual Setup (if script doesn't work)

### Step 1: Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

Restart your terminal after installation.

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
bun install
```

**Frontend:**
```bash
cd frontend/HardwareHub
bun install
```

### Step 3: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (takes ~2 minutes)
3. Go to **SQL Editor** (left sidebar)
4. Copy the contents of `backend/supabase-schema.sql`
5. Paste into the SQL Editor and click **Run**
6. Go to **Project Settings** → **API** to get your credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

### Step 4: Configure Environment Variables

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/HardwareHub/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:3000
```

### Step 5: Seed Database (Optional)

You can manually add lessons to your Supabase database or use the frontend's mock data initially. To migrate mock data to Supabase, you'll need to insert the lesson data from `frontend/HardwareHub/src/data/lessonData.ts` into the `lessons` table.

### Step 6: Run Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
bun run dev
```

You should see:
```
🚀 Server starting on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/HardwareHub
bun run dev
```

You should see:
```
VITE v7.x.x ready in XXX ms
➜ Local: http://localhost:5173
```

### Step 7: Test the Application

1. Open your browser to `http://localhost:5173`
2. Click "Sign Up" and create a test account
3. Browse the learning track
4. Try creating a project
5. Take some notes on a lesson

## Troubleshooting

### "Bun command not found"

After installing Bun, you need to restart your terminal or run:
```bash
source ~/.bashrc  # or ~/.zshrc for zsh
```

### "Connection refused" errors

Make sure the backend server is running on port 3000:
```bash
cd backend
bun run dev
```

### Supabase connection errors

1. Double-check your `.env` files have the correct Supabase URL and keys
2. Make sure you ran the `supabase-schema.sql` in your Supabase SQL Editor
3. Check that your Supabase project is active (not paused)

### CORS errors

If you see CORS errors in the browser console:
1. Make sure `FRONTEND_URL` in `backend/.env` matches your frontend URL
2. Restart the backend server after changing `.env` files

### Port already in use

If port 3000 or 5173 is already in use:

**Backend:**
```bash
# Change PORT in backend/.env to a different port like 3001
PORT=3001
```

**Frontend:**
```bash
# Vite will automatically try the next available port, or you can specify one:
vite --port 5174
```

## Development Workflow

### Starting Fresh

```bash
# Backend
cd backend
bun run dev

# Frontend (in new terminal)
cd frontend/HardwareHub
bun run dev
```

### Making Changes

- **Backend API changes**: Edit files in `backend/src/routes/` - server auto-restarts
- **Frontend changes**: Edit files in `frontend/HardwareHub/src/` - hot reload enabled
- **Database schema changes**: Update `backend/supabase-schema.sql` and re-run in Supabase

### Testing API Endpoints

You can test the API directly:

```bash
# Health check
curl http://localhost:3000

# Get all lessons
curl http://localhost:3000/api/lessons

# Get specific lesson
curl http://localhost:3000/api/lessons/1
```

## Production Deployment

See the main [README.md](./README.md#-deployment) for deployment instructions.

## Need Help?

- Check the [Backend README](./backend/README.md)
- Check the [Frontend README](./frontend/HardwareHub/README.md)
- Review IF MAGIC docs: https://docs.ifmagic.io
- Check Supabase docs: https://supabase.com/docs

## Next Steps

Once everything is running:

1. **Seed Lessons**: Add the 20 IF MAGIC module lessons to your database
2. **Customize**: Update branding, colors, and content
3. **Deploy**: Deploy frontend to Vercel and backend to Vercel/Cloudflare
4. **Enhance**: Add more features like user authentication, achievements, etc.

Happy coding! 🚀
