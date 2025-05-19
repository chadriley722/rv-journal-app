#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Create database
echo "Creating database..."
createdb rv_journal

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=rv_journal
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOL
    echo "Please update the .env file with your database credentials."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run migrations
echo "Running database migrations..."
npm run migrate

echo "Setup complete! You can now start the development server with 'npm run dev'" 