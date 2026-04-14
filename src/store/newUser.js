export const demoUser = {
  id: "demo-user-1",
  firstName: "Demo",
  lastName: "User",
  email: "demo@example.com",
  hasCompletedOnboarding: true,
  password: "password", // NOSONAR
  resetPasswordLink: "/reset-password?token=demo-reset-token",
  createdAt: new Date().toISOString(),
};

export const adminUser = {
  id: "admin-user-1",
  firstName: "Test",
  lastName: "Admin",
  email: "admin@example.com",
  password: "admin@123", // NOSONAR
  role: "admin",
  onboardingComplete: true,
  createdAt: new Date().toISOString(),
};

export default demoUser;
