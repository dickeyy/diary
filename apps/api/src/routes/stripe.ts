import Elysia from "elysia";
import { Webhook } from "svix";
import { constructWHEvent, getPortalLink } from "../lib/stripe";
import config from "../../config";
import { updateClerkStripeMetadata } from "../lib/clerk";
import { getUserByStripeCustomerID } from "../lib/user";
import { logsnagUserDowngrade, logsnagUserUpgrade } from "../lib/logsnag";

const stripe = new Elysia({ prefix: "/stripe" });

// GET /stripe/portal
stripe.get("/portal/:customer_id", async ({ set, params }) => {
    const customerID = params.customer_id;
    const portalLink = await getPortalLink(customerID || "");

    set.status = 200;
    return { url: portalLink };
});

// POST /stripe/webhook
stripe.post("/webhook", async ({ set, request, headers }) => {
    const whsec = config.stripe.webhookSecret;
    let evt: any;

    // verify the webhook
    try {
        const sig = headers["stripe-signature"];
        const arrayBuffer = await request.arrayBuffer(); // Using request.arrayBuffer() to read the body
        const rawBody = Buffer.from(arrayBuffer);
        evt = constructWHEvent(rawBody, sig as string);
    } catch (e) {
        console.error(e);
        set.status = 400; // Set appropriate status code for error
        return { message: "Webhook verification failed" };
    }
    // Handle the event
    // only handle subscription.updated events because that's all we care about for now
    switch (evt.type) {
        case "customer.subscription.updated":
            const user = await getUserByStripeCustomerID(evt.data.object.customer);
            if (user === null) {
                set.status = 404;
                return { message: "User not found" };
            }
            const newPlan =
                evt.data.object.items.data[0].plan.id === config.stripe.prices.free
                    ? "free"
                    : "plus";
            await updateClerkStripeMetadata(user, newPlan);

            // logsnag the subscription update
            if (newPlan === "free") await logsnagUserDowngrade(user.id, user.username, user.email);
            if (newPlan === "plus") await logsnagUserUpgrade(user.id, user.username, user.email);
            break;
        default:
            set.status = 400;
            return { message: "Invalid event type" };
    }

    return { message: "Webhook received" };
});

export default stripe;
