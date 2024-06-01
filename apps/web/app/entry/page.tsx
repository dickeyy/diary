"use client";

import { createDocument, fetchAllDocuments, todayDocExists } from "@/lib/doc-funcs";
import useDocumentStore from "@/stores/document-store";
import { DocumentType } from "@/types/Document";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
    const { selectedDocument, documents } = useDocumentStore.getState();
    const { getToken } = useAuth();

    useEffect(() => {
        if (selectedDocument) {
            redirect(`/entry/${selectedDocument.id}`);
        }
    }, [selectedDocument]);

    return <></>;
}
