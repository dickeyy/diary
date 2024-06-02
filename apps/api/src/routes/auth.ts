import Elysia from "elysia";
import { Webhook } from "svix";
import config from "../../config";
import { createUser, deleteUser, getUserByID, updateUser } from "../lib/user";
import { createCustomer, createFreeSubscription, deleteCustomer } from "../lib/stripe";
import { updateClerkStripeMetadata } from "../lib/clerk";

const auth = new Elysia({ prefix: "/auth" });

auth.post("/webhook/user", async ({ set, headers, request }) => {
    const whsec = config.clerk.webhookSecret;
    let evt: any;

    // verify the webhook
    try {
        const arrayBuffer = await request.arrayBuffer(); // Using request.arrayBuffer() to read the body
        const rawBody = Buffer.from(arrayBuffer);
        const wh = new Webhook(whsec);
        evt = wh.verify(rawBody, headers as any);
    } catch (e) {
        console.error(e);
        set.status = 400; // Set appropriate status code for error
        return { message: "Webhook verification failed" };
    }

    // Handle the event
    switch (evt.type) {
        case "user.created":
            try {
                const user = await createUser(evt.data);
                if (user === null) {
                    set.status = 500;
                    return { message: "Failed to create user" };
                }

                // create a customer in Stripe
                const customer = await createCustomer(user.email);
                // subscribe to the free plan (for billing portal)
                const subscription = await createFreeSubscription(customer);

                // update clerk metadata with stripe customer id & add the stripe customer id to the user object
                user.stripe_customer_id = customer.id;
                await updateClerkStripeMetadata(user, "free");

                if (!subscription.id) {
                    set.status = 500;
                    return { message: "Failed to create subscription" };
                }
            } catch (e) {
                console.error(e);
                set.status = 500;
                return { message: "Failed to create user" };
            }
            return { message: "User created" };
        case "user.updated":
            try {
                const user = await updateUser(evt.data);
                if (user === null) {
                    set.status = 500;
                    return { message: "Failed to update user" };
                }
            } catch (e) {
                console.error(e);
                set.status = 500;
                return { message: "Failed to update user" };
            }

            return { message: "User updated" };
        case "user.deleted":
            try {
                const user = await getUserByID(evt.data.id);
                const delUser = await deleteUser(evt.data.id);
                const delCustomer = await deleteCustomer(user?.stripe_customer_id || "");

                if (!delUser || !delCustomer) {
                    set.status = 500;
                    return { message: "Failed to delete customer" };
                }
            } catch (e) {
                console.error(e);
                set.status = 500;
                return { message: "Failed to delete user" };
            }

            return { message: "User deleted" };
        default:
            set.status = 400;
            return { message: "Invalid event type" };
    }
});

export default auth;
