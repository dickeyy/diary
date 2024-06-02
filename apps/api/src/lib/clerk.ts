import { clerkClient } from "@clerk/clerk-sdk-node";
import { UserType } from "../types/User";

export async function updateClerkStripeMetadata(user: UserType, plan: "free" | "plus") {
    await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
            stripeCustomerId: user.stripe_customer_id,
            plan: plan
        }
    });
}
