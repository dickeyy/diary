"use client";

import AccountDropdown from "./account-dropdown";
import { ScrollArea } from "./ui/scroll-area";
import useDocumentStore from "@/stores/document-store";
import { useAuth } from "@clerk/nextjs";
import { DocumentType } from "@/types/Document";
import useClerkSWR from "@/lib/clerk-swr";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createDocument, fetchAllDocuments } from "@/lib/doc-funcs";
import Spinner from "./ui/spinner";
import { Button } from "./ui/button";
import { redirect, useRouter } from "next/navigation";

export default function Sidebar() {
    const { documents } = useDocumentStore();
    const router = useRouter();
    const { getToken } = useAuth();
    const { data, error } = useClerkSWR(`${process.env.NEXT_PUBLIC_API_URL}/documents/all`);

    useEffect(() => {
        if (data) {
            useDocumentStore.setState({ documents: data.documents });
        }
    }, [data]);

    // function to create a new document
    const cd = async () => {
        const token = await getToken();
        createDocument(token || "").then((res) => {
            if (res.ok) {
                toast.success("Document created");
                fetchAllDocuments(token || "").then((res) => {
                    if (res.ok) {
                        // update the documents in the store
                        res.json().then((res) => {
                            useDocumentStore.setState({
                                documents: res.documents,
                                selectedDocument: res.documents[0]
                            });
                            router.push(`/entry/${res.documents[0].id}`);
                        });
                    }
                });
            } else {
                toast.error("Error creating document");
            }
        });
    };
    if (documents) {
        return (
            <aside className="bg-background fixed left-0 top-0 z-50 flex h-screen w-fit min-w-12 max-w-52 flex-col justify-between overflow-y-hidden p-4">
                <div className="flex flex-col items-center">
                    <Button className="w-full" variant="outline" onClick={cd}>
                        New Entry
                    </Button>

                    <div className="mt-4 flex w-full flex-col items-start text-left">
                        <p className="text-foreground/60 mb-2 text-sm">Entries</p>
                        <ScrollArea className="h-[85vh] w-full pb-2">
                            {documents.length === 0 ? (
                                <p className="text-foreground/40 text-sm">No entries yet</p>
                            ) : (
                                documents.map((doc) => (
                                    <SidebarTab
                                        key={doc.id}
                                        label={doc.title}
                                        document={doc}
                                        router={router}
                                    />
                                ))
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <AccountDropdown />
            </aside>
        );
    } else {
        return <></>;
    }
}

function SidebarTab({
    label,
    document,
    router
}: {
    label: string;
    document: DocumentType;
    router: any;
}) {
    const { selectedDocument } = useDocumentStore.getState();
    const isActive = selectedDocument?.id === document.id;

    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className="text-foreground/60 flex h-fit w-full items-start justify-start py-1 text-left font-normal"
            onClick={() => {
                useDocumentStore.setState({ selectedDocument: document });
                router.push(`/entry/${document.id}`);
            }}
        >
            {label}
        </Button>
    );
}
