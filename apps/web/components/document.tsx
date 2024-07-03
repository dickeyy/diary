"use client";

import { useCallback, useEffect, useState } from "react";
import Editor from "./editor";
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
import { debounce, get } from "lodash";
import type { DocumentType } from "@/types/Document";
import { useAuth } from "@clerk/nextjs";
import useDocumentStore from "@/stores/document-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import useWebSocket from "react-use-websocket";
import { usePlausible } from "next-plausible";

export default function Document({ document }: { document?: DocumentType }) {
    const { getToken } = useAuth();
    const plausible = usePlausible();

    // ws stuff
    const [socketUrl, setSocketUrl] = useState(
        `${process.env.NEXT_PUBLIC_API_URL?.startsWith("http://") ? "ws" : "wss"}://${process.env.NEXT_PUBLIC_API_URL?.split("://")[1]}/documents/ws`
    );
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
        onError: () => {
            toast.error("Error connecting to server");
        },
        retryOnError: true
    });

    const [doc, setDoc] = useState(document);
    const [content, setContent] = useState(doc?.content);
    const [metadata, setMetadata] = useState(doc?.metadata);

    const [isSaving, setIsSaving] = useState(false);
    const [wordCount, setWordCount] = useState(
        doc?.content
            ? JSON.parse(doc.content)
                  .map(
                      (block: any) =>
                          block.children
                              .map((child: any) => child.text)
                              .join(" ")
                              .split(" ").length
                  )
                  .reduce((a: any, b: any) => a + b, 0)
            : 0
    );
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
            getToken()
                .then((token: any) => {
                    if (content !== doc?.content) {
                        setIsSaving(true);
                        sendJsonMessage({
                            message: "update content",
                            data: {
                                doc_id: doc?.id || "",
                                content_to_save: content ? content : ""
                            },
                            token: token || ""
                        });
                    } else {
                        setIsSaving(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Error saving document", {
                        description:
                            "Something went wrong while trying to authenticate. Please try again.",
                        duration: 5000
                    });
                });

            if (content) {
                const blocks = JSON.parse(content);
                // a block looks like this: { type: "p", children: [{ text: "hello world" }] }
                // blocks is an array of these
                // we want to count the words in each block.children.map((child) => child.text) <- basically the text in the block
                setWordCount(
                    blocks
                        .map(
                            (block: any) =>
                                block.children
                                    .map((child: any) => child.text)
                                    .join(" ")
                                    .split(" ").length
                        )
                        .reduce((a: any, b: any) => a + b, 0)
                );
            }
        }, 500), // Adjust the debounce delay as needed
        [content, doc?.content]
    );

    // function to save the metadata
    const saveMetadata = useCallback(
        debounce(() => {
            getToken()
                .then((token: any) => {
                    if (JSON.stringify(metadata) !== JSON.stringify(doc?.metadata)) {
                        setIsSaving(true);
                        sendJsonMessage({
                            message: "update metadata",
                            data: {
                                doc_id: doc?.id || "",
                                metadata: metadata
                            },
                            token: token || ""
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Error saving document", {
                        description:
                            "Something went wrong while trying to authenticate. Please try again.",
                        duration: 5000
                    });
                });
        }, 1000), // Adjust the debounce delay as needed
        [metadata, doc?.metadata]
    );

    // handle websocket messages
    useEffect(() => {
        if (lastMessage !== null) {
            if (JSON.parse(lastMessage.data).message === "success") {
                if (JSON.parse(lastMessage.data).doc) {
                    // update all the states
                    setIsSaving(false);
                    setDocUpdatedAt(new Date().getTime());
                    setSinceUpdate("just now");
                    setDoc(JSON.parse(lastMessage.data).doc);
                }
            } else if (JSON.parse(lastMessage.data).message === "error") {
                toast.error("Error saving document", {
                    description:
                        "Something went wrong while trying to save the document. Please try again.",
                    duration: 5000
                });
                // revert the content
                setContent(doc?.content || "");
                setIsSaving(false);
            } else if (JSON.parse(lastMessage.data).message === "invalid token") {
                toast.error("Invalid token", {
                    description:
                        "Something went wrong while trying to authenticate. Please try again.",
                    duration: 5000
                });
                // revert the content
                setContent(doc?.content || "");
                setIsSaving(false);
            }
        }
    }, [
        lastMessage,
        setIsSaving,
        setDocUpdatedAt,
        setSinceUpdate,
        setDoc,
        setContent,
        doc?.content
    ]);

    // Call saveContent whenever content changes
    useEffect(() => {
        if (content !== doc?.content) {
            saveContent();
        }

        // Cancel the debounce on component unmount
        return () => saveContent.cancel();
    }, [content, saveContent, doc?.content]);

    // Call saveMetadata whenever metadata changes
    useEffect(() => {
        if (JSON.stringify(metadata) !== JSON.stringify(doc?.metadata)) {
            saveMetadata();

            if (metadata?.font_size !== doc?.metadata?.font_size) {
                plausible("document_font_size_change");
            }
        }

        // Cancel the debounce on component unmount
        return () => saveMetadata.cancel();
    }, [metadata, doc?.metadata, saveMetadata, plausible]);

    return (
        <div className="col-span-1 flex min-h-screen w-full flex-col items-start justify-start pt-4">
            <nav className="bg-background fixed left-0 top-0 z-10 flex w-full items-center justify-end gap-4 px-8 py-2">
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
                    <DropdownMenuContent className="mr-8 w-fit">
                        <div className="flex w-full flex-col items-start p-1">
                            <p className="text-foreground/40 text-xs font-medium">Font Family</p>
                            <DropdownMenuSeparator />
                            <div className="flex w-full flex-row items-start justify-between gap-1">
                                <Button
                                    variant={metadata?.font === "serif" ? "outline" : "ghost"}
                                    className="h-fit w-full border py-2"
                                    onClick={() => {
                                        if (metadata) {
                                            plausible("document_font_family_change");
                                            setMetadata({
                                                ...metadata,
                                                font: "serif"
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <p className="text-foreground font-serif text-xl font-medium">
                                            Ag
                                        </p>
                                        <p className="text-foreground/40 text-xs font-medium">
                                            Serif
                                        </p>
                                    </div>
                                </Button>
                                <Button
                                    variant={metadata?.font === "sans" ? "outline" : "ghost"}
                                    className="h-fit w-full border py-2"
                                    onClick={() => {
                                        if (metadata) {
                                            plausible("document_font_family_change");
                                            setMetadata({
                                                ...metadata,
                                                font: "sans"
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <p className="text-foreground font-sans text-xl font-medium">
                                            Ag
                                        </p>
                                        <p className="text-foreground/40 text-xs font-medium">
                                            Sans
                                        </p>
                                    </div>
                                </Button>
                                <Button
                                    variant={metadata?.font === "mono" ? "outline" : "ghost"}
                                    className="h-fit w-full border py-2"
                                    onClick={() => {
                                        if (metadata) {
                                            plausible("document_font_family_change");
                                            setMetadata({
                                                ...metadata,
                                                font: "mono"
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <p className="text-foreground font-mono text-xl font-medium">
                                            Ag
                                        </p>
                                        <p className="text-foreground/40 text-xs font-medium">
                                            Mono
                                        </p>
                                    </div>
                                </Button>
                            </div>

                            <p className="text-foreground/40 mb-2 mt-3 text-xs font-medium">
                                Font Size
                            </p>
                            <div className="flex w-full flex-row items-center justify-between gap-1 rounded border ">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        if (metadata) {
                                            setMetadata({
                                                ...metadata,
                                                font_size: metadata.font_size - 1
                                            });
                                        }
                                    }}
                                >
                                    -
                                </Button>
                                <p className="text-foreground text-sm font-medium">
                                    {metadata?.font_size} px
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        if (metadata) {
                                            setMetadata({
                                                ...metadata,
                                                font_size: metadata.font_size + 1
                                            });
                                        }
                                    }}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => {
                                setIsBlured(!isBlured);
                                plausible("document_blur");
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
                <Editor
                    content={content || ""}
                    setContent={setContent}
                    isBlured={isBlured}
                    metadata={metadata || {}}
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
    const plausible = usePlausible();

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
                plausible("document_deleted");
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
