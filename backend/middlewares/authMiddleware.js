import { clerkClient } from "@clerk/express";

export const requireAdmin = async (req, res, next) => {
  // If Clerk Publishable Key or Secret Key is not configured, bypass authentication in development mode
  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    console.warn("⚠️ Warning: CLERK_PUBLISHABLE_KEY or CLERK_SECRET_KEY is missing in backend/.env. Bypassing requireAdmin auth middleware for local testing.");
    return next();
  }

  try {
    // Clerk middleware populates req.auth
    const authState = typeof req.auth === "function" ? req.auth() : req.auth;
    if (!authState || !authState.userId) {
      console.warn("❌ requireAdmin: Verification failed. Auth Header:", req.headers.authorization, "Auth State:", authState);
      return res.status(401).json({ message: "Unauthorized: Invalid or expired session token" });
    }

    // Retrieve user object from Clerk using verified userId
    const user = await clerkClient.users.getUser(authState.userId);
    const role = user?.publicMetadata?.role;
    const emails = user?.emailAddresses?.map((e) => e.emailAddress) || [];
    const hasAdminEmail = emails.includes("shantanukamble.org@gmail.com");

    if (role !== "admin" && !hasAdminEmail) {
      return res.status(403).json({ message: "Forbidden: Administrator permissions required" });
    }

    next();
  } catch (error) {
    console.error("❌ Authentication error in requireAdmin middleware:", error.message);
    res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};
