const config = {
    port: process.env.PORT as string,
    db: {
        url: process.env.DB_URL as string
    },
    clerk: {
        webhookSecret: process.env.CLERK_USER_WH_SECRET as string,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY as string,
        secretKey: process.env.CLERK_SECRET_KEY as string
    },
    crypto: {
        key: process.env.ENCRYPTION_KEY as string
    },
    stripe: {
        publishableKey: process.env.STRIPE_PUB_KEY as string,
        secretKey: process.env.STRIPE_SECRET_KEY as string,
        prices: {
            free: process.env.STRIPE_FREE_PRICE_ID as string,
            plus: process.env.STRIPE_PLUS_PRICE_ID as string
        },
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string
    },
    logsnag: {
        apiKey: process.env.LOGSNAG_API_KEY as string,
        projectName: process.env.LOGSNAG_PROJECT_NAME as string
    }
};

export default config;
