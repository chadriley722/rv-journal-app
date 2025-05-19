# RV Journal Web Application

A web application for RV enthusiasts to track their journeys and experiences. Built with TypeScript, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Journal entry creation and management
- Location tracking
- Photo uploads
- Social sharing

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest
- **API Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chadriley722/rv-journal-app.git
   cd rv-journal-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/rv_journal
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Run database migrations:
   ```bash
   npm run migrate up
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Journal Entries
- `GET /api/entries` - Get all entries
- `POST /api/entries` - Create new entry
- `GET /api/entries/:id` - Get entry by ID
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run migrate` - Run database migrations

### Project Structure

```
rv-journal-app/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── app.ts          # Application entry point
├── tests/              # Test files
├── migrations/         # Database migrations
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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