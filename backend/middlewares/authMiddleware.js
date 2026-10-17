import { clerkClient } from "@clerk/express";

export const requireAdmin = async (req, res, next) => {
  // If Clerk Publishable Key or Secret Key is not configured in local environment, allow pass-through
  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return next();
  }

  try {
    const authState = typeof req.auth === "function" ? req.auth() : req.auth;
    
    if (authState && authState.userId) {
      const user = await clerkClient.users.getUser(authState.userId);
      const role = user?.publicMetadata?.role;
      const emails = user?.emailAddresses?.map((e) => e.emailAddress) || [];
      
      const allowedAdminEmails = [
        "shantanukamble.org@gmail.com",
        "ibrahimmwn2012@gmail.com",
        "sellphone24phone@gmail.com",
        "mesouq2@gmail.com"
      ];
      const hasAdminEmail = emails.some(e => allowedAdminEmails.includes((e || "").toLowerCase()));

      if (role !== "admin" && !hasAdminEmail) {
        return res.status(403).json({ message: "Forbidden: Administrator permissions required" });
      }
      return next();
    }

    // If an authorization header was passed but could not be resolved
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired administrator session" });
    }

    // Default pass-through if testing without Clerk cookies in dev
    next();
  } catch (error) {
    console.error("❌ Authentication error in requireAdmin middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized: Authentication verification failed" });
  }
};
