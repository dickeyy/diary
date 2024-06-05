"use client";

import useDocumentStore from "@/stores/document-store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { selectedDocument, documents } = useDocumentStore.getState();

    useEffect(() => {
        if (selectedDocument) {
            redirect(`/entry/${selectedDocument.id}`);
        }
    }, [selectedDocument]);

    return <></>;
}
