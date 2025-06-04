#!/bin/bash

# Battle of the LLMs - Startup Script
echo "🤖⚔️ Starting Battle of the LLMs..."

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Please create backend/.env file with your API keys!"
    echo "   Copy backend/env_example.txt to backend/.env and add your keys"
    exit 1
fi

# Start backend in background
echo "🚀 Starting Flask backend..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting!"
echo "📍 Backend:  http://localhost:5001"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "⚡ Ready to battle! Choose your fighters and start comparing summaries!"
echo ""
echo "To stop servers:"
echo "   Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"

# Keep script running
wait 