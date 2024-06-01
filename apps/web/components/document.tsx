"use client";

import { useCallback, useEffect, useState } from "react";
import ContentInput from "./content-input";
import Spinner from "./ui/spinner";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import ms from "ms";
import { Trash2Icon } from "lucide-react";
import { debounce } from "lodash";
import type { DocumentType } from "@/types/Document";
import { useAuth } from "@clerk/nextjs";
import useDocumentStore from "@/stores/document-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Document({ document }: { document?: DocumentType }) {
    const { getToken } = useAuth();
    const router = useRouter();
    const [doc, setDoc] = useState(document);
    const [content, setContent] = useState(doc?.content || "");
    const [isSaving, setIsSaving] = useState(false);
    const [wordCount, setWordCount] = useState(doc?.content ? doc.content.split(" ").length : 0);
    const [charCount, setCharCount] = useState(doc?.content ? doc.content.length : 0);
    const [docUpdatedAt, setDocUpdatedAt] = useState(doc?.updated_at);
    const [sinceUpdate, setSinceUpdate] = useState(
        new Date().getTime() - (docUpdatedAt as any) * 1000 < 10000
            ? "just now"
            : ms(new Date().getTime() - (docUpdatedAt as any) * 1000) + " ago"
    );

    const sinceCreate =
        new Date().getTime() - (doc?.created_at as any) * 1000 < 10000
            ? "just now"
            : ms(new Date().getTime() - (doc?.created_at as any) * 1000) + " ago";

    // Function to save the content
    const saveContent = useCallback(
        debounce(() => {
            setIsSaving(true);

            // save the content
            getToken().then((token: any) => {
                save(doc?.id || "", content ? content : "", token || "").then(() => {
                    setIsSaving(false);
                    setDocUpdatedAt(new Date().getTime());
                    setSinceUpdate("just now");
                });
            });

            setWordCount(content?.split(" ").length || 0);
            setCharCount(content?.length || 0);
        }, 1000), // Adjust the debounce delay as needed
        [content]
    );

    const dd = async () => {
        getToken().then((token: any) => {
            deleteDoc(doc?.id || "", token || "").then(() => {
                toast.success("Document deleted");
                // remove the document from the array
                useDocumentStore.setState({
                    documents: useDocumentStore.getState().documents.filter((rdoc) => {
                        return rdoc.id !== doc?.id;
                    })
                });
                // set the selected doc to the next doc in the array
                const nextDoc = useDocumentStore.getState().documents[0];
                if (nextDoc) {
                    useDocumentStore.setState({ selectedDocument: nextDoc });

                    router.replace("/entry/" + nextDoc.id);
                } else {
                    router.replace("/entry");
                }
            });
        });
    };

    // Call saveContent whenever content changes
    useEffect(() => {
        if (content === doc?.content) {
            return;
        }

        saveContent();
        // Cancel the debounce on component unmount
        return () => saveContent.cancel();
    }, [content, saveContent, doc?.content]);

    return (
        <div className="flex w-full flex-col items-center justify-center pt-4">
            <nav className="fixed top-0 flex w-full items-center justify-end gap-4 px-8 pt-4">
                {isSaving ? (
                    <div className="flex flex-row items-center gap-2">
                        <Spinner className="fill-foreground/60 h-3 w-3" />
                        <p className="text-foreground/60 text-xs font-medium">Saving</p>
                    </div>
                ) : (
                    <p className="text-foreground/60 text-xs font-medium">Edited {sinceUpdate}</p>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="h-fit w-fit px-2 py-1">
                            <DotsHorizontalIcon className="fill-foreground/60 h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-8 w-48">
                        <DropdownMenuItem className="focus:bg-red-500/20" onSelect={dd}>
                            <Trash2Icon className="mr-2 h-[1rem] w-[1rem]" />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div className="flex w-full flex-col items-start gap-1 px-2 py-2 text-left">
                            <p className="text-foreground/40 flex-wrap text-xs font-medium">
                                Word count: {wordCount.toLocaleString()}
                            </p>
                            <p className="text-foreground/40 flex-wrap text-xs font-medium">
                                Char count: {charCount.toLocaleString()} / 20k
                            </p>
                            <p className="text-foreground/40 text-xs font-medium">
                                Created {sinceCreate}
                            </p>
                            <p className="text-foreground/40 text-xs font-medium">
                                Last edited {sinceUpdate}
                            </p>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            <div className="mt-[0.85rem] flex w-[60%] flex-col items-start justify-start">
                <p className="text-foreground/60 text-md mb-4 text-center font-mono font-medium">
                    {doc?.title}
                </p>
                <ContentInput content={content || ""} setContent={setContent} />
            </div>
        </div>
    );
}

const save = async (id: string, content: string, token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: content })
    });
    if (!res.ok) {
        toast.error("Error saving document");
        return;
    }
    return res.json();
};

const deleteDoc = async (id: string, token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        toast.error("Error deleting document");
        return;
    }
    return res.json();
};
