// Temporary demo user for UI testing only — no persistence
export const demoUser = {
  id: "demo-user-1",
  firstName: "Demo",
  lastName: "User",
  email: "demo@example.com",
  // Plaintext here only for quick UI testing — remove in production
  // Plaintext here only for quick UI testing — remove in production
  // NOSONAR: intentionally hard-coded demo credential for local UI tests
  password: "password", // NOSONAR
  createdAt: new Date().toISOString(),
};

export default demoUser;
