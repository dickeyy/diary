import { and, desc, eq } from "drizzle-orm";
import db from "../db/drizzle";
import { documents } from "../db/schema";
import type { DocumentType } from "../types/Document";
import { decrypt, encrypt, generateUUID } from "./crypto";

export async function getUserDocuments(userID: string): Promise<DocumentType[]> {
    const docs = await db
        .select()
        .from(documents)
        .where(eq(documents.owner_id, userID))
        .orderBy(desc(documents.created_at))
        .execute();
    return docs as any;
}

export async function getDocumentByID(id: string, userID: string): Promise<DocumentType | null> {
    const doc = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.owner_id, userID)))
        .limit(1)
        .execute();
    if (!doc || doc.length === 0) {
        return null;
    }
    // decrypt content
    if (doc[0].content) {
        const decryptedContent = await decrypt(doc[0].content || "");
        doc[0].content = decryptedContent;
    }
    return doc as any;
}

export async function updateDocumentMetadata(
    id: string,
    metadata: any
): Promise<DocumentType | null> {
    const now = Math.floor(new Date().getTime() / 1000);

    const doc = await db.select().from(documents).where(eq(documents.id, id)).limit(1).execute();
    if (!doc) {
        return null;
    }

    try {
        await db
            .update(documents)
            .set({ metadata: metadata, updated_at: now })
            .where(eq(documents.id, id))
            .execute();
    } catch (e) {
        console.error(e);
        return null;
    }

    doc[0].metadata = metadata;
    doc[0].updated_at = now;
    doc[0].content = await decrypt(doc[0].content || "");
    return doc[0] as any;
}

export async function updateDocumentByID(
    id: string,
    content: string
): Promise<DocumentType | null> {
    const now = Math.floor(new Date().getTime() / 1000);

    const doc = await db.select().from(documents).where(eq(documents.id, id)).limit(1).execute();
    if (!doc) {
        return null;
    }

    const encryptedContent = await encrypt(content);
    if (!encryptedContent) {
        console.error("Error encrypting content");
        return null;
    }

    try {
        await db
            .update(documents)
            .set({ content: encryptedContent, updated_at: now })
            .where(eq(documents.id, id))
            .execute();
    } catch (e) {
        console.error(e);
        return null;
    }

    doc[0].content = content;
    doc[0].updated_at = now;
    return doc[0] as any;
}

export async function updateDocumentTitle(id: string, title: string): Promise<DocumentType | null> {
    const now = Math.floor(new Date().getTime() / 1000);

    const doc = await db.select().from(documents).where(eq(documents.id, id)).limit(1).execute();
    if (!doc) {
        return null;
    }

    try {
        if (title.length === 0) {
            title = "Untitled";
        } else if (title.length > 255) {
            title = title.substring(0, 255);
        }

        await db
            .update(documents)
            .set({ title: title, updated_at: now })
            .where(eq(documents.id, id))
            .execute();
    } catch (e) {
        console.error(e);
        return null;
    }

    doc[0].title = title;
    doc[0].updated_at = now;
    doc[0].content = await decrypt(doc[0].content || "");
    return doc[0] as any;
}

export async function deleteDocumentByID(id: string, userID: string): Promise<boolean> {
    try {
        await db
            .delete(documents)
            .where(and(eq(documents.id, id), eq(documents.owner_id, userID)))
            .execute();
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

export async function createDocument(userID: string, title: string): Promise<DocumentType | null> {
    const now = Math.floor(new Date().getTime() / 1000);

    const doc: DocumentType = {
        id: generateUUID(),
        title: title,
        content: null,
        owner_id: userID,
        created_at: now,
        updated_at: now,
        metadata: {
            font: "serif",
            font_size: 18
        }
    };
    try {
        await db.insert(documents).values(doc).execute();
    } catch (e) {
        console.error(e);
        return null;
    }

    return doc as any;
}
