# Boutique Shopping Cart with Okta SSO

This project implements Okta SSO (Single Sign-On) authentication for a Boutique Shopping Cart application built with Next.js and Express.

## Features

- Okta SSO authentication
- Protected routes requiring authentication
- User profile display
- Backend API with JWT validation
- Fallback to email/password authentication

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Okta Developer Account

## Okta Setup

1. Create a free Okta Developer Account at [https://developer.okta.com/signup/](https://developer.okta.com/signup/)
2. Log in to your Okta Developer Dashboard
3. Navigate to **Applications** > **Create App Integration**
4. Select **OIDC - OpenID Connect** as the Sign-in method
5. Choose **Single-Page Application (SPA)** as the Application type
6. Configure the application:
   - Name: Boutique Shopping Cart
   - Grant type: Authorization Code
   - Sign-in redirect URIs: http://localhost:3000/login/callback
   - Sign-out redirect URIs: http://localhost:3000
   - Trusted Origins: http://localhost:3000
7. Under **Assignments**, assign the app to **Everyone** or specific groups
8. Save your Client ID and Okta Domain

## Configuration

1. Update the Okta configuration in `frontend/src/oktaConfig.ts`:
   ```typescript
   export const oktaConfig = {
     clientId: "YOUR_CLIENT_ID",
     issuer: "https://YOUR_OKTA_DOMAIN/oauth2/default",
     redirectUri: typeof window !== "undefined" 
       ? window.location.origin + "/login/callback" 
       : "",
     scopes: ["openid", "profile", "email", "api://default"],
     pkce: true,
     tokenManager: {
       storage: 'localStorage'
     }
   };
   ```

2. Update the backend `.env` file:
   ```
   PORT=3001
   OKTA_ISSUER=https://YOUR_OKTA_DOMAIN/oauth2/default
   OKTA_CLIENT_ID=YOUR_CLIENT_ID
   OKTA_AUDIENCE=api://default
   CORS_ORIGIN=http://localhost:3000
   ```

## Installation

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

## Running the Application

1. Start both frontend and backend:
   ```bash
   npm run dev
   ```

2. Or start them separately:
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend
   cd frontend
   npm run dev
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Authentication Flow

1. User navigates to the application
2. User clicks "Sign In with Okta"
3. User is redirected to Okta login page
4. After successful authentication, user is redirected back to the application
5. The application receives an authorization code
6. The application exchanges the code for tokens
7. The application uses the access token to make API requests

## API Endpoints

- `GET /api/public` - Public endpoint (no authentication required)
- `GET /api/protected` - Protected endpoint (requires valid JWT)
- `GET /api/user/profile` - User profile endpoint (requires valid JWT)

## Troubleshooting

- **CORS Issues**: Ensure your Okta application has the correct Trusted Origins
- **Redirect URI Mismatch**: Verify the redirect URI in your Okta application matches the one in your code
- **Token Validation Errors**: Check that your issuer URL and audience are correct

## Security Considerations

- Always use HTTPS in production
- Keep your Okta Client ID and Secret secure
- Implement proper token validation on the backend
- Use secure storage for tokens (this implementation uses localStorage for simplicity)