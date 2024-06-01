import Elysia, { t } from "elysia";
import { createDocument, getUserDocuments, getDocumentByID, updateDocumentByID, deleteDocumentByID } from "../lib/document";

const docs = new Elysia({ prefix: "/documents" });

docs.get("/all", async ({ clerk, store, set }) => {
    if (!store.auth?.userId) {
        set.status = 403
        return 'Unauthorized'
    }

    const user = await clerk.users.getUser(store.auth?.userId)
    if (!user) {
        set.status = 404
        return 'User not found'
    }

    const documents = await getUserDocuments(user.id)
    if (!documents) {
        set.status = 404
        return 'Documents not found'
    }

    return { documents }
})

docs.get("/:id", async ({ clerk, store, set, params }) => {
    if (!store.auth?.userId) {
        set.status = 403
        return 'Unauthorized'
    }

    const user = await clerk.users.getUser(store.auth?.userId)
    if (!user) {
        set.status = 404
        return 'User not found'
    }

    const document = await getDocumentByID(params.id, user.id)
    if (!document) {
        set.status = 404
        return 'Document not found'
    }

    return { document }
})

const updateDocSchema = {
    body: t.Object(
        {
            content: t.String({
                minLength: 0,
                maxLength: 65535, 
            }),

        },
        {
            error: "Invalid request body"
        }
    )
};

docs.post("/:id", async ({ clerk, store, set, params, body }) => {
    if (!store.auth?.userId) {
        set.status = 403
        return 'Unauthorized'
    }

    const user = await clerk.users.getUser(store.auth?.userId)
    if (!user) {
        set.status = 404
        return 'User not found'
    }

    const document = await updateDocumentByID(params.id, body.content)
    if (!document) {
        set.status = 500
        return 'Error updating document'
    }
    
    return { document }
}, updateDocSchema)

// delete
docs.delete("/:id", async ({ clerk, store, set, params }) => {
    if (!store.auth?.userId) {
        set.status = 403
        return 'Unauthorized'
    }

    const user = await clerk.users.getUser(store.auth?.userId)
    if (!user) {
        set.status = 404
        return 'User not found'
    }

    const success = await deleteDocumentByID(params.id, user.id)
    if (!success) {
        set.status = 500
        return 'Error deleting document'
    }

    return { success }
})


const createDocSchema = {
    body: t.Object(
        {
            title: t.String({
                minLength: 1,
                maxLength: 255, 
            }),

        },
        {
            error: "Invalid request body"
        }
    )
};

docs.post("/", async ({ clerk, store, set, body }) => {
    if (!store.auth?.userId) {
        set.status = 403
        return 'Unauthorized'
    }

    const user = await clerk.users.getUser(store.auth?.userId)
    if (!user) {
        set.status = 404
        return 'User not found'
    }

    const document = await createDocument(user.id, body.title)
    if (!document) {
        set.status = 500
        return 'Error creating document'
    }

    return { document }
}, createDocSchema)

export default docs;
