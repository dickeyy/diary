import { ClerkClient, clerkClient } from "@clerk/clerk-sdk-node";
import { UserType } from "../types/User";

export async function updateClerkStripeMetadata(user: UserType, plan: "free" | "plus") {
    await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
            stripeCustomerId: user.stripe_customer_id,
            plan: plan
        }
    });
}

export async function validateClerkToken(token: string): Promise<any | null> {
    try {
        const ses = await clerkClient.verifyToken(token);
        if (!ses) {
            return null;
        }
        const user = await clerkClient.users.getUser(ses.sub);
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}
