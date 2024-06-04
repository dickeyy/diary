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
import { EyeIcon, EyeOffIcon, Trash2Icon } from "lucide-react";
import { debounce } from "lodash";
import type { DocumentType } from "@/types/Document";
import { useAuth } from "@clerk/nextjs";
import useDocumentStore from "@/stores/document-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import posthog from "posthog-js";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Document({ document }: { document?: DocumentType }) {
    const { getToken } = useAuth();

    // ws stuff
    const [socketUrl, setSocketUrl] = useState(
        `${process.env.NEXT_PUBLIC_API_URL?.startsWith("http://") ? "ws" : "wss"}://${process.env.NEXT_PUBLIC_API_URL?.split("://")[1]}/documents/ws`
    );
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: () => true
    });

    const [doc, setDoc] = useState(document);
    const [content, setContent] = useState(doc?.content);
    const [isSaving, setIsSaving] = useState(false);
    const [wordCount, setWordCount] = useState(doc?.content ? doc.content.split(" ").length : 0);
    const [charCount, setCharCount] = useState(doc?.content ? doc.content.length : 0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [docUpdatedAt, setDocUpdatedAt] = useState(doc?.updated_at);
    const [isBlured, setIsBlured] = useState(false);

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
            // save the content
            getToken().then((token: any) => {
                setIsSaving(true);

                if (token) {
                    if (content !== doc?.content) {
                        sendJsonMessage({
                            message: "update content",
                            data: {
                                doc_id: doc?.id || "",
                                content_to_save: content ? content : ""
                            },
                            token: token || ""
                        });

                        // slight delay to allow the message to be sent
                        setTimeout(() => {
                            setIsSaving(false);
                        }, 500);
                    } else {
                        setIsSaving(false);
                    }
                }
            });

            setWordCount(content?.split(" ").length || 0);
            setCharCount(content?.length || 0);
        }, 500), // Adjust the debounce delay as needed
        [content, doc?.content]
    );

    // handle websocket messages
    useEffect(() => {
        if (lastMessage !== null) {
            if (JSON.parse(lastMessage.data).message === "success") {
                if (JSON.parse(lastMessage.data).doc) {
                    setDocUpdatedAt(new Date().getTime());
                    setSinceUpdate("just now");
                }
            } else if (JSON.parse(lastMessage.data).message === "error") {
                toast.error("Error saving document", {
                    description:
                        "Something went wrong while trying to save the document. Please try again.",
                    duration: 5000
                });
                // revert the content
                setContent(doc?.content || "");
            } else if (JSON.parse(lastMessage.data).message === "invalid token") {
                toast.error("Invalid token", {
                    description:
                        "Something went wrong while trying to authenticate. Please sign out and sign in again.",
                    duration: 5000
                });
                // revert the content
                setContent(doc?.content || "");
            }
        }
    }, [lastMessage]);

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
        <div className="col-span-1 flex w-full flex-col items-start justify-center pt-4 ">
            <nav className="bg-background fixed left-0 top-0 flex w-full items-center justify-end gap-4 px-8 py-2">
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
                        <DropdownMenuItem
                            onSelect={() => {
                                setIsBlured(!isBlured);
                                posthog.capture("document_blur", {
                                    blurred: isBlured ? "true" : "false"
                                });
                            }}
                        >
                            {isBlured ? (
                                <EyeIcon className="mr-2 h-[1rem] w-[1rem]" />
                            ) : (
                                <EyeOffIcon className="mr-2 h-[1rem] w-[1rem]" />
                            )}
                            {isBlured ? "Unhide" : "Hide"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="focus:bg-red-500/20"
                            onSelect={() => setIsDeleteDialogOpen(true)}
                        >
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
            <div className="mt-[2rem] flex w-full flex-col items-start justify-start md:mx-auto md:w-full md:max-w-full lg:max-w-[50rem] 2xl:max-w-[60rem]">
                <p className="text-foreground/60 text-md mb-4 flex-wrap text-left font-mono font-medium ">
                    {doc?.title}
                </p>
                <ContentInput
                    content={content || ""}
                    setContent={setContent}
                    isBlured={isBlured}
                    setIsBlured={setIsBlured}
                />
            </div>

            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onStateChange={setIsDeleteDialogOpen}
                doc={doc}
            />
        </div>
    );
}

function ConfirmDeleteDialog({
    isOpen,
    onStateChange,
    doc
}: {
    isOpen: boolean;
    onStateChange: any;
    doc?: DocumentType;
}) {
    const { getToken } = useAuth();
    const router = useRouter();

    const dd = async () => {
        getToken().then((token: any) => {
            deleteDoc(doc?.id || "", token || "").then(() => {
                // remove the document from the array
                useDocumentStore.setState({
                    documents: useDocumentStore.getState().documents.filter((rdoc) => {
                        return rdoc.id !== doc?.id;
                    })
                });
                // set the selected doc to the next doc in the array
                posthog.capture("document_deleted");
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

    return (
        <Dialog open={isOpen} onOpenChange={onStateChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Are you sure you want to delete this entry?
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8 gap-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onStateChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={dd}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
