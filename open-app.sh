#!/bin/bash

# Check if both servers are running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "Frontend server is not running. Please start it with 'cd frontend && npm run dev'"
    exit 1
fi

if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Backend server is not running. Please start it with 'cd backend && npm run dev'"
    exit 1
fi

# Open the application in the default browser
open http://localhost:5173 