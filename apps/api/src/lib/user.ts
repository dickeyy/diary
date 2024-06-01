import { eq } from "drizzle-orm";
import db from "../db/drizzle";
import { users } from "../db/schema";
import { UserType } from "../types/User";

export async function createUser(data: any): Promise<UserType | null> {
    const newUser: UserType = {
        id: data.id,
        email: data.email_addresses[0].email_address,
        image_url: data.image_url,
        username: data.username,
        created_at: data.created_at,
        updated_at: data.updated_at,
    }

    try {
        await db.insert(users).values(newUser).execute();
    } catch (e) {
        console.error(e);
        return null;
    }

    return newUser;
}

export async function updateUser(data:any): Promise<UserType | null> {
    const updatedUser: UserType = {
        id: data.id,
        email: data.email_addresses[0].email_address,
        image_url: data.image_url,
        username: data.username,
        created_at: data.created_at,
        updated_at: data.updated_at,
    }

    try {
        await db.update(users).set(updatedUser).where(eq(users.id, data.id)).execute();
    } catch (e) {
        console.error(e);
        return null;
    }

    return updatedUser;
}

export async function deleteUser(userID:string): Promise<boolean> {
    try {
        await db.delete(users).where(eq(users.id, userID)).execute();
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}
