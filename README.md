# RV Journal App

A web application for RV enthusiasts to track their journeys and experiences.

## Product Requirements

For detailed product requirements and project roadmap, see the [Product Requirements Document (PRD)](docs/PRD.md).

## Project Structure

## Project Structure

- **backend/**: Node.js/Express backend with PostgreSQL database.
  - **src/**: Source code for the backend.
  - **drizzle/**: Database migrations and schema.
  - **package.json**: Backend dependencies and scripts.

- **frontend/**: React + TypeScript frontend built with Vite.
  - **src/**: Source code for the frontend.
  - **public/**: Static assets.
  - **package.json**: Frontend dependencies and scripts.

## Getting Started

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your `.env` file with the following variables:
   ```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=rv_journal_dev
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- User registration and login
- Journal entry management (create, read, update, delete)
- Protected routes with JWT authentication

## License

This project is licensed under the GPL-3.0 License.

The GNU GPL is a free, copyleft license that ensures the software remains free and open source. This means:

- You are free to use, modify, and distribute the software
- You must make any modifications available under the same license
- You must include the original copyright notice
- You must include a copy of the license
- You must state significant changes made to the software

For more information about the GNU GPL v3.0, visit [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

## Contact

Chad - [@chadriley722](https://github.com/chadriley722)

Project Link: [https://github.com/chadriley722/rv-journal-app](https://github.com/chadriley722/rv-journal-app)