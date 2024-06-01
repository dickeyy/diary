import config from "../../config";
import crypto from "crypto";

// generate UUID
export function generateUUID(prefix?: string) {
    const uuid = crypto.randomUUID();
    if (prefix) {
        return `${prefix}_${uuid}`;
    }
    return uuid;
}

// derive a master key from a given string
export async function deriveKey(str: string): Promise<Buffer> {
    const hash = crypto.createHash("sha256").update(str).digest();
    return hash;
}

// encrypt string
export async function encrypt(str: string): Promise<string> {   
    const key = await deriveKey(config.crypto.key);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(str, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

// decrypt string
export async function decrypt(str: string): Promise<string> {
    const key = await deriveKey(config.crypto.key);
    const parts = str.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = Buffer.from(parts[1], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted.toString("hex"), "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// base64 encode string
export function base64Encode(str: string): string {
    return Buffer.from(str).toString("base64");
}

// base64 decode string
export function base64Decode(str: string): string {
    return Buffer.from(str, "base64").toString("utf8");
}