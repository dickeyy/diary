import { DocumentType } from "@/types/Document";

export async function createDocument(token: string): Promise<Response> {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            title: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        })
    });
    return req;
}

export async function fetchAllDocuments(token: string): Promise<Response> {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return req;
}

export async function fetchDocument(id: string, token: string): Promise<Response> {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return req;
}

export function todayDocExists(documents: DocumentType[]): DocumentType | undefined {
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const todayDoc = documents.find((doc) => doc.title === today.toString());
    return todayDoc;
}
