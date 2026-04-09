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

export default demoUser;
