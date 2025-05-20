const express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'this-should-be-very-secure-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Okta OIDC configuration
const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  scope: 'openid profile email'
});

// Initialize the OIDC middleware
app.use(oidc.router);

// Middleware to check authentication status
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Public routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  // The login page is handled by Okta
  res.redirect('/login');
});

// OAuth callback route is automatically handled by oidc middleware

// Protected routes
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API route to get user information
app.get('/api/user', ensureAuthenticated, (req, res) => {
  res.json(req.userContext.userinfo);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
oidc.on('ready', () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

oidc.on('error', err => {
  console.error('OIDC error', err);
});