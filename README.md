# Karmooch - Portfolio Management Application

A modern web application for managing investment portfolios with user authentication and real-time portfolio tracking.

## Tech Stack

- **Frontend**: React with Material-UI
- **Backend**: Spring Boot with Java
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT-based user authentication

## Features

- User registration and authentication
- Portfolio creation and management
- Investment tracking and analysis
- Real-time portfolio updates
- Responsive Material-UI interface

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd karmooch
   ```

2. **Start the application with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## Development

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Local Development Setup
1. Install dependencies:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend (Spring Boot uses Maven/Gradle)
   cd backend && ./mvnw clean install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the database:
   ```bash
   docker-compose up db
   ```

4. Run the application:
   ```bash
   # Backend
   cd backend && ./mvnw spring-boot:run
   
   # Frontend (in another terminal)
   cd frontend && npm start
   ```

## Project Structure

```
karmooch/
├── frontend/          # React application
├── backend/           # Spring Boot API server
├── database/          # Database migrations and seeds
├── docker-compose.yml # Docker orchestration
└── README.md         # This file
```

## API Documentation

The backend API provides the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create new portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `GET /api/investments` - Get portfolio investments
- `POST /api/investments` - Add investment to portfolio

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
