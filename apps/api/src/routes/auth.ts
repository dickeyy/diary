import Elysia from "elysia";
import { Webhook } from 'svix';
import config from "../../config";
import { createUser, deleteUser, updateUser } from "../lib/user";

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
                const user = createUser(evt.data);
                if (user === null) {
                    set.status = 500;
                    return { message: "Failed to create user" };
                }
            } catch (e) {
                console.error(e);
                set.status = 500;
                return { message: "Failed to create user" };
            }
            return { message: "User created" };
        case "user.updated":
            try {
                const user = updateUser(evt.data);
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
                const success = deleteUser(evt.data.id);
                if (!success) {
                    set.status = 500;
                    return { message: "Failed to delete user" };
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
