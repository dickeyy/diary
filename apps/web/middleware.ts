import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
    // allow external requests to the API
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/api/(.*)"]
};
