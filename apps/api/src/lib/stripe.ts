import { Stripe } from "stripe";
import config from "../../config";

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2024-04-10",
    typescript: true
});

export function constructWHEvent(body: any, sig: string) {
    return stripe.webhooks.constructEvent(body, sig, config.stripe.webhookSecret);
}

export async function createCustomer(email: string): Promise<Stripe.Customer> {
    const customer = await stripe.customers.create({
        email
    });

    return customer;
}

export async function deleteCustomer(customerID: string): Promise<boolean> {
    try {
        await stripe.customers.del(customerID);
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

export async function updateCustomer(customerID: string, data: any): Promise<boolean> {
    try {
        await stripe.customers.update(customerID, data);
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

export async function createFreeSubscription(
    customer: Stripe.Customer
): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
            {
                price: config.stripe.prices.free,
                quantity: 1
            }
        ]
    });

    return subscription;
}

export async function createPlusSubscription(
    customer: Stripe.Customer
): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
            {
                price: config.stripe.prices.plus,
                quantity: 1
            }
        ]
    });

    return subscription;
}

export async function getPortalLink(customerID: string): Promise<string> {
    const portalLink = await stripe.billingPortal.sessions.create({
        customer: customerID,
        return_url: "https://diary.kyle.so/entry"
    });

    return portalLink.url;
}
