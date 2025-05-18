"use client";

// oktaConfig.js
export const oktaConfig = {
  clientId: "ESbt1xsT7tW4Re6fjDr2NbYyaXdZw1QS",
  issuer: "https://dev-12345678.okta.com/oauth2/default", // Replace with your actual Okta domain
  redirectUri:
    typeof window !== "undefined"
      ? window.location.origin + "/login/callback"
      : "",
  scopes: ["openid", "profile", "email"],
  pkce: true,
};
