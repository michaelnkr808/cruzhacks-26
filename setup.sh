#!/bin/bash

# EmbedPath Setup Script
# This script sets up both frontend and backend with Bun

echo "🚀 Setting up EmbedPath..."
echo ""

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed"
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    
    # Source the shell config to make bun available
    if [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc"
    fi
    
    echo "✅ Bun installed successfully!"
else
    echo "✅ Bun is already installed"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
bun install
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend/HardwareHub
bun install
cd ../..

echo ""
echo "📝 Setting up environment files..."

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "⚠️  Created backend/.env from .env.example"
    echo "   Please update it with your Supabase credentials"
else
    echo "✅ backend/.env already exists"
fi

# Create frontend .env if it doesn't exist
if [ ! -f "frontend/HardwareHub/.env" ]; then
    cp frontend/HardwareHub/.env.example frontend/HardwareHub/.env
    echo "⚠️  Created frontend/.env from .env.example"
    echo "   Please update it with your Supabase credentials"
else
    echo "✅ frontend/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Run the SQL from backend/supabase-schema.sql in your Supabase SQL Editor"
echo "3. Update backend/.env with your Supabase credentials"
echo "4. Update frontend/HardwareHub/.env with your Supabase credentials"
echo "5. Start the backend: cd backend && bun run dev"
echo "6. Start the frontend (in new terminal): cd frontend/HardwareHub && bun run dev"
echo ""
echo "Happy coding! 🎉"
