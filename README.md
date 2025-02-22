# Notes For anyone that will read the readme.md:
This notes section is added on saturday. I think it is really needed and it doesn't add any value to the documentation or code:
I just remembered I need to add it.

 - This documentation is not fully finished :(. I forgot about it and didn't edit it well after finishing.
 - Not all endpoints and routes are included here. Check files in routes folder. they present all the routes.
 - A websocket route exists and allows a connection but does nothing. It needs the logic of: checking for if a permission exists with a new creation timestamp before then sending location updates....
 - Run server with : CLI: node server.js

The rest below was added on friday during trail time.

# Node.js API with Express and PostgreSQL

This project is a Node.js API built with Express and PostgreSQL. It provides endpoints for managing users, including creating and reading user data. The project also includes JWT authentication and uses Jest for testing.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Features

- RESTful API using Express
- PostgreSQL database integration
- JWT authentication
- Input validation
- Error handling
- Unit and integration tests with Jest and Supertest

## Requirements

- Node.js (version 14 or later)
- PostgreSQL
- npm (Node package manager)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add your database and JWT secret configurations:
    ```env
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret
    PORT=3030
    ```

## Database Setup

1. Start the server:
    ```bash
    npm run dev
    ```

2. Open your browser or a tool like Postman, and make a GET request to:
    ```
    http://localhost:3030/api/migrate
    ```
   This endpoint will create all necessary tables in your PostgreSQL database.

## Running the Application

1. Start the server:
    ```bash
    npm run dev
    ```

2. The API will be accessible at `http://localhost:3030`.

## API Endpoints

### Users

- **GET /api/users/:userId**: Get user by userId
    - Response: 200 OK, 404 Not Found

- **POST /auth/register**: Create a new user
    - Request body:
      ```json
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@example.com",
        "password": "your_password",
        "phone": "123-456-7890"
      }
      ```
    - Response: 201 Created, 400 Bad Request

### Authentication

- **POST /auth/login**: Authenticate user and get a token
    - Request body:
      ```json
      {
        "email": "johndoe@example.com",
        "password": "your_password"
      }
      ```
    - Response: 200 OK, 401 Unauthorized

## Testing

1. To run tests:
    ```bash
    npm test
    ```

2. Tests are written using Jest and Supertest. They are located in the `tests` directory.

## License

This project is licensed under the MIT License.
