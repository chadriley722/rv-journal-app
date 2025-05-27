# RV Journal Web Application

A comprehensive web application for RV enthusiasts to track their journeys, maintenance, and experiences. This application allows users to document their RV lifestyle with rich media support, maintenance tracking, and detailed journey logs.

## Technology Stack

- **Framework:** Ruby on Rails 7.1.5
- **Ruby Version:** 3.3.8
- **Database:** PostgreSQL
- **Frontend:** Bootstrap 5, Stimulus JS, Hotwire/Turbo
- **Authentication:** Devise (to be implemented)
- **Authorization:** CanCanCan (to be implemented)
- **File Storage:** Active Storage
- **Rich Text:** Action Text

## Features (Planned)

- User registration and authentication
- RV profile management
- Maintenance tracking and scheduling
- Journey/travel logging
- Rich media support (photos, documents)
- Dashboard with statistics and insights
- Search functionality
- Privacy controls

## Setup Instructions

### Prerequisites

- Ruby 3.3.8
- Rails 7.1.5
- PostgreSQL
- Node.js and Yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/chadriley722/rv-journal-app.git
   cd rv-journal-app
   ```

2. Install dependencies
   ```bash
   bundle install
   yarn install
   ```

3. Setup the database
   ```bash
   rails db:create
   rails db:migrate
   ```

4. Start the development server
   ```bash
   bin/dev
   ```

5. Visit http://localhost:3000 in your browser

## Testing

Run the test suite with:
```bash
rails test
```

Detailed testing with RSpec will be implemented in future updates.

## Development Roadmap

See the PRD document for the detailed development plan, which includes:

1. Foundation Setup
2. User Management System
3. Core Data Models & Associations
4. Advanced Features
5. Search & Navigation
6. Testing & Quality Assurance
7. Deployment & Production Readiness

## License

This project is licensed under the GPL-3.0 License.
