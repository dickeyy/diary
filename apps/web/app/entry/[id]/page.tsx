"use client";

import Document from "@/components/document";
import Spinner from "@/components/ui/spinner";
import useClerkSWR from "@/lib/clerk-swr";
import useDocumentStore from "@/stores/document-store";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: { id: string } }) {
    const { data, error } = useClerkSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${params.id}`
    );
    const [document, setDocument] = useState(undefined);

    useEffect(() => {
        if (data) {
            if (data.document) {
                setDocument(data?.document[0]);
                useDocumentStore.setState({ selectedDocument: data.document[0] });
            }
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            useDocumentStore.setState({ selectedDocument: undefined });
            redirect("/entry");
        }
    }, [error]);

    if (!data || !document) {
        return (
            <div className="flex h-full w-full items-center justify-center p-12 sm:p-4">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center p-4 pb-8">
            <Document document={document} />
            {/* <WebSocketDemo /> */}
        </div>
    );
}
