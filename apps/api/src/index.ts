import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import config from "../config";
import { logger } from "@grotto/logysia";
import { clerkPlugin } from "elysia-clerk";

// import routes
import auth from "./routes/auth";
import docs from "./routes/documents";
import stripe from "./routes/stripe";

const app = new Elysia();

// Middleware
app.use(cors());
app.use(
    clerkPlugin({
        publishableKey: config.clerk.publishableKey,
        secretKey: config.clerk.secretKey
    })
);
app.use(
    logger({
        logIP: false
    })
);

// Routes
app.get("/", () => {
    return { message: "hey" };
});
app.use(auth); // /auth/*
app.use(docs); // /documents/*
app.use(stripe); // /stripe/*

app.listen(config.port);
console.log(`Server running on port ${config.port}`);
