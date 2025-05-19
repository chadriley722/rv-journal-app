# RV Journal Web Application

A web application for RV enthusiasts to track their journeys and experiences.

## Features

- User authentication (register/login)
- Create and manage journal entries
- Track RV locations and experiences
- Secure API endpoints with JWT authentication

## Tech Stack

- TypeScript
- Express.js
- PostgreSQL
- Drizzle ORM
- JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rv-journal-app.git
cd rv-journal-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=rv_journal
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key
```

4. Create the database:
```bash
createdb rv_journal
```

5. Run migrations:
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Journal Entries

- `GET /api/journal` - Get all journal entries
- `POST /api/journal` - Create a new journal entry
- `GET /api/journal/:id` - Get a specific journal entry
- `PUT /api/journal/:id` - Update a journal entry
- `DELETE /api/journal/:id` - Delete a journal entry

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

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