import { LogSnag } from "@logsnag/node";
import config from "../../config";

const logsnag = new LogSnag({
    token: config.logsnag.apiKey,
    project: config.logsnag.projectName
});

// account create
export async function logsnagAcctCreate(user_id: string, username: string, email: string) {
    await logsnag.track({
        channel: "users",
        event: "Account Created",
        user_id: user_id,
        description: username + " created an account.",
        icon: "👤",
        notify: true
    });

    await logsnag.identify({
        user_id: user_id,
        properties: {
            name: username,
            email: email,
            plan: "free"
        }
    });

    // increment user count
    await logsnag.insight.increment({
        title: "User Count",
        value: 1,
        icon: "👨"
    });
}

// account delete
export async function logsnagAcctDelete(user_id: string) {
    await logsnag.track({
        channel: "users",
        event: "Account Deleted",
        user_id: user_id,
        description: "Account deleted.",
        icon: "👤",
        notify: true
    });

    // decrement user count
    await logsnag.insight.increment({
        title: "User Count",
        value: -1,
        icon: "👨"
    });
}

// user upgrades to plus plan
export async function logsnagUserUpgrade(user_id: string, username: string, email: string) {
    await logsnag.track({
        channel: "payments",
        event: "Plan Upgraded",
        user_id: user_id,
        description: username + " upgraded to Plus plan.",
        icon: "👤",
        notify: true
    });

    await logsnag.identify({
        user_id: user_id,
        properties: {
            name: username,
            email: email,
            plan: "plus"
        }
    });

    // increment plus user count
    await logsnag.insight.increment({
        title: "Plus User Count",
        value: 1,
        icon: "⭐️"
    });

    // increase mmr by $4.99
    await logsnag.insight.increment({
        title: "MRR",
        value: 4.99,
        icon: "💸"
    });
}

// user downgrades to free plan
export async function logsnagUserDowngrade(user_id: string, username: string, email: string) {
    await logsnag.track({
        channel: "payments",
        event: "Plan Downgraded",
        user_id: user_id,
        description: username + " downgraded to Free plan.",
        icon: "👤",
        notify: true
    });

    await logsnag.identify({
        user_id: user_id,
        properties: {
            name: username,
            email: email,
            plan: "free"
        }
    });

    // decrement plus user count
    await logsnag.insight.increment({
        title: "Plus User Count",
        value: -1,
        icon: "⭐️"
    });

    // decrease mrr by $4.99
    await logsnag.insight.increment({
        title: "MRR",
        value: -4.99,
        icon: "💸"
    });
}
