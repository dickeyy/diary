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
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Sidebar() {
    const { documents } = useDocumentStore();
    const router = useRouter();
    const { getToken } = useAuth();
    const { data, error } = useClerkSWR(`${process.env.NEXT_PUBLIC_API_URL}/documents/all`);
    const [isSideOpen, setIsSideOpen] = useState(false);

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
                            setIsSideOpen(false);
                            posthog.capture("document_created");
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
            <>
                {/* desktop view */}
                <aside className="bg-background z-50 col-span-1 hidden h-screen w-full flex-col justify-between overflow-y-hidden p-4 md:flex">
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

                {/* mobile view */}
                <div className="fixed left-4 top-[0.75rem] z-[50] flex md:hidden">
                    <Sheet open={isSideOpen} onOpenChange={setIsSideOpen}>
                        <SheetTrigger>
                            <MenuIcon className="h-5 w-5" />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full">
                            <div className="mt-8 flex flex-col items-center justify-between gap-4">
                                <Button className="w-full" variant="outline" onClick={cd}>
                                    New Entry
                                </Button>

                                <div className="mt-4 flex h-full w-full flex-col items-start text-left">
                                    <p className="text-foreground/60 mb-2 text-sm">Entries</p>
                                    <ScrollArea className="mb-4 h-[60vh] w-full gap-1">
                                        {documents.length === 0 ? (
                                            <p className="text-foreground/40 text-sm">
                                                No entries yet
                                            </p>
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
                                <AccountDropdown />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </>
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
