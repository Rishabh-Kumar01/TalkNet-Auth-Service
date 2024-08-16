# AuthService with Passport

## Overview

AuthService is a robust authentication and authorization microservice built with Node.js and Express. It provides secure user authentication using JWT (JSON Web Tokens), along with social login options via Google and Facebook OAuth 2.0. The service also integrates with an OTP (One-Time Password) service for additional security measures.

## Features

- User registration and login
- JWT-based authentication
- Google OAuth 2.0 integration
- Facebook OAuth 2.0 integration
- Password hashing using bcrypt
- OTP generation and verification (via separate OTP service)
- MongoDB for data persistence
- Kafka integration for inter-service communication

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Kafka
- Google Developer Console project (for Google OAuth)
- Facebook Developer account (for Facebook OAuth)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Rishabh-Kumar01/TalkNet-Auth-Service.git
   cd TalkNet-Auth-Service
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/auth_service
   BCRYPT_SALT=your_brcypt_salt_value
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=your_jwt_expires_time
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   CALLBACK_URL=your_callback_url
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### User Registration

- **POST** `/api/v1/auth/signup`
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

### User Login

- **POST** `/api/v1/auth/login`
  - Body: `{ "email": "string", "password": "string" }`

### Google OAuth

- **GET** `/api/v1/auth/google`
- **GET** `/api/v1/auth/google/callback`

### Facebook OAuth

- **GET** `/api/v1/auth/facebook`
- **GET** `/api/v1/auth/facebook/callback`

## Usage

1. Register a new user:

   ```
   curl -X POST http://localhost:3000/api/v1/auth/signup \
   -H "Content-Type: application/json" \
   -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
   ```

2. Login with registered user:

   ```
   curl -X POST http://localhost:3000/api/v1/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email": "test@example.com", "password": "password123"}'
   ```

3. For Google and Facebook OAuth, direct users to `/api/v1/auth/google` and `/api/v1/auth/facebook` respectively.

## Authentication Flow

1. User signs up or logs in.
2. Server validates credentials and generates a JWT.
3. JWT is sent back to the client.
4. Client includes JWT in the Authorization header for subsequent requests.
5. Server validates JWT for protected routes.

## OTP Integration

After successful registration, the service sends a message to Kafka to trigger OTP generation and sending via the OTP service.

## Error Handling

The service uses a centralized error handling middleware. All errors are caught and formatted consistently before being sent as responses.

## Security Considerations

- Passwords are hashed using bcrypt before storage.
- JWT secrets and OAuth credentials should be kept secure and not committed to version control.
- In production, ensure all communications are over HTTPS.


