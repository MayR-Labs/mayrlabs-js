process.env.MAYRLABS_AUTH_PUBLIC_JWK = JSON.stringify({
  kty: "RSA",
  n: "...",
  e: "...",
});
process.env.MAYRLABS_AUTH_PRIVATE_JWK = JSON.stringify({
  kty: "RSA",
  n: "...",
  e: "...",
});
process.env.MAYRLABS_CLIENT_ID = "test-id";
process.env.MAYRLABS_CLIENT_SECRET = "test-secret";
process.env.MAYRLABS_ACCOUNT_URL = "https://testing.com";
process.env.MAYRLABS_CLIENT_AUDIENCE = "test-audience";
process.env.MAYRLABS_AUTH_ISSUER = "test-issuer";
process.env.MAYRLABS_AUTH_SESSION_KEY = "mayrlabs-auth-session";
process.env.MAYRLABS_AUTH_ERROR_REDIRECT = "/login";
process.env.MAYRLABS_AUTH_SUCCESS_REDIRECT = "/dashboard";
process.env.NODE_ENV = "test";
