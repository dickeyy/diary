import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import config from "../config";
import { clerkPlugin } from "elysia-clerk";

// import routes
import auth from "./routes/auth";
import docs from "./routes/documents";

const app = new Elysia();

// Middleware
app.use(cors());
app.use(
    clerkPlugin({ 
        publishableKey: config.clerk.publishableKey, 
        secretKey: config.clerk.secretKey 
    })
);

// Routes
app.use(auth); // /auth/*
app.use(docs); // /documents/*

app.listen(config.port);
console.log(`Server running on port ${config.port}`);
