import { relations } from "drizzle-orm";
import { text, pgTable, varchar, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    image_url: text("image_url"),
    username: varchar("username", { length: 255 }).unique(),
    created_at: bigint("created_at", {
        mode: "number"
    }).notNull(),
    updated_at: bigint("updated_at", {
        mode: "number"
    }).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(documents)
}));

export const documents = pgTable("documents", {
    id: varchar("id", { length: 255 }).primaryKey(),
    owner_id: varchar("owner_id", { length: 255 }).notNull(),
    title: text("title"),
    content: text("content"),
    created_at: bigint("created_at", {
        mode: "number"
    }).notNull(),
    updated_at: bigint("updated_at", {
        mode: "number"
    }).notNull()
});

export const documentRelations = relations(documents, ({ one }) => ({
    author: one(users, {
        fields: [documents.owner_id],
        references: [users.id]
    })
}));
