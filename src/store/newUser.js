export const demoUser = {
  id: "demo-user-1",
  firstName: "Demo",
  lastName: "User",
  email: "demo@example.com",
  onboardingComplete: true,
  role: "user",
  password: "password", // NOSONAR
  resetPasswordLink: "/reset-password?token=demo-reset-token",
  createdAt: new Date().toISOString(),
};

export const adminDemoUser = {
  id: "demo-admin-1",
  firstName: "Admin",
  lastName: "Dietitian",
  email: "admin@example.com",
  onboardingComplete: true,
  role: "admin",
  password: "admin12345", // NOSONAR
  resetPasswordLink: "/reset-password?token=admin-reset-token",
  createdAt: new Date().toISOString(),
};

export default demoUser;
