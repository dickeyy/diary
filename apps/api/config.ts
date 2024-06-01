const config = {
    port: process.env.PORT as string,
    db: {
        url: process.env.DB_URL as string,
    },
    clerk: {webhookSecret: process.env.CLERK_USER_WH_SECRET as string,publishableKey: process.env.CLERK_PUBLISHABLE_KEY as string,
        secretKey: process.env.CLERK_SECRET_KEY as string,
    },
    crypto: {
        key: process.env.ENCRYPTION_KEY as string,
    }
}

export default config;
