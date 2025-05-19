# Okta SSO Implementation Details

## Overview

This document provides details about the Okta SSO implementation in the Boutique Shopping Cart application.

## Frontend Implementation

### Authentication Flow

1. **Configuration**: The Okta configuration is defined in `src/oktaConfig.ts` with client ID, issuer, redirect URI, and scopes.

2. **Authentication Pages**:
   - `/auth` - Main authentication page that initializes Okta and provides sign-in options
   - `/auth/local` - Traditional email/password login as a fallback
   - `/login/callback` - Handles the OAuth callback after Okta authentication

3. **Components**:
   - `OktaWrapper.tsx` - Wraps the application with Okta authentication context
   - `OktaLoginPage.tsx` - Provides the Okta login UI and handles login/signup flows
   - `ProtectedRoute.tsx` - Ensures routes are only accessible to authenticated users
   - `UserInfo.tsx` - Displays user profile information from Okta

4. **API Integration**:
   - `services/api.ts` - Handles API requests with JWT authentication

### Key Files

- `src/oktaConfig.ts` - Okta configuration
- `src/components/auth/OktaWrapper.tsx` - Okta authentication wrapper
- `src/components/auth/OktaLoginPage.tsx` - Okta login UI
- `src/components/auth/ProtectedRoute.tsx` - Route protection
- `src/components/auth/UserInfo.tsx` - User profile display
- `src/hooks/useAuth.ts` - Authentication hook
- `src/services/api.ts` - API service with JWT authentication
- `src/app/auth/page.tsx` - Main authentication page
- `src/app/login/callback/page.tsx` - OAuth callback handler
- `src/app/profile/page.tsx` - Protected profile page

## Backend Implementation

### Authentication Validation

1. **JWT Validation**: The backend uses `express-jwt` and `jwks-rsa` to validate JWTs issued by Okta.

2. **Protected Routes**: API endpoints are protected using JWT middleware.

3. **User Information**: The backend can extract user information from the validated JWT.

### Key Files

- `server.ts` - Express server with JWT validation
- `.env` - Environment variables for Okta configuration

## Security Considerations

1. **PKCE Flow**: The implementation uses PKCE (Proof Key for Code Exchange) for enhanced security.

2. **Token Storage**: Tokens are stored in localStorage (for simplicity, but consider more secure options for production).

3. **JWT Validation**: The backend properly validates JWTs using Okta's JWKS endpoint.

4. **Scopes**: The implementation uses appropriate OAuth scopes for the required permissions.

## Integration Points

1. **Okta Developer Console**: The application must be registered in the Okta Developer Console.

2. **Environment Variables**: Both frontend and backend require configuration through environment variables.

3. **API Endpoints**: The backend provides endpoints that validate Okta JWTs.

## Testing

To test the implementation:

1. Configure Okta with valid credentials
2. Start both frontend and backend servers
3. Navigate to the application and attempt to sign in with Okta
4. Verify that protected routes require authentication
5. Verify that user information is correctly displayed after authentication