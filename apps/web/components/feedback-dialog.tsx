"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useLogSnag } from "@logsnag/next";
import Spinner from "./ui/spinner";
import { usePlausible } from "next-plausible";

const formSchema = z.object({
    messsage: z
        .string()
        .min(10, {
            message: "Message must be at least 10 characters."
        })
        .max(1000, {
            message: "Message must be less than 1000 characters."
        })
});

export default function FeedbackDialog({
    isOpen,
    onStateChange
}: {
    isOpen: boolean;
    onStateChange: any;
}) {
    const { user } = useUser();
    const { track } = useLogSnag();
    const plausible = usePlausible();

    const [feedbackType, setFeedbackType] = useState<"Bug" | "Idea" | "Other" | null>(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            messsage: ""
        }
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        const valToSend = {
            ...values,
            user_id: user?.id || "",
            type: feedbackType
        };

        track({
            channel: "feedback",
            event: "Feedback Submitted",
            description: valToSend.messsage,
            user_id: user?.id || "",
            icon: feedbackType === "Bug" ? "🐛" : feedbackType === "Idea" ? "💡" : "💬",
            tags: {
                type: feedbackType || "",
                email: user?.primaryEmailAddress?.emailAddress || ""
            },
            notify: true
        });

        plausible("feedback_submitted");
    }

    return (
        <Dialog open={isOpen} onOpenChange={onStateChange}>
            <DialogContent>
                <DialogHeader>
                    {form.formState.isSubmitSuccessful ? (
                        <>
                            <DialogTitle>Thank you for your feedback!</DialogTitle>
                            <DialogDescription>
                                Your feedback has been submitted. We will review it and respond
                                shortly. We may reach out to you via email, so keep an eye on your
                                inbox!
                            </DialogDescription>
                        </>
                    ) : (
                        <>
                            <DialogTitle>Feedback</DialogTitle>
                            <DialogDescription>
                                Share your feedback to help improve Diary.
                            </DialogDescription>
                        </>
                    )}
                </DialogHeader>

                <div className="flex w-full flex-col items-center justify-center gap-4">
                    {!form.formState.isSubmitSuccessful && (
                        <>
                            <div className="flex w-full flex-col items-center justify-center gap-4">
                                <div className="flex w-full flex-row items-center justify-between gap-2">
                                    <FeedbackType
                                        type="Bug"
                                        onSelect={setFeedbackType}
                                        isActive={feedbackType === "Bug"}
                                    />
                                    <FeedbackType
                                        type="Idea"
                                        onSelect={setFeedbackType}
                                        isActive={feedbackType === "Idea"}
                                    />
                                    <FeedbackType
                                        type="Other"
                                        onSelect={setFeedbackType}
                                        isActive={feedbackType === "Other"}
                                    />
                                </div>
                                {feedbackType && (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}>
                                            <FormField
                                                control={form.control}
                                                name="messsage"
                                                render={({ field }) => (
                                                    <FormItem className="mt-4 w-full">
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder={
                                                                    feedbackType === "Bug"
                                                                        ? "What happened?"
                                                                        : "What's on your mind?"
                                                                }
                                                                className="h-32 max-h-40"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your account information will be used to
                                                            help improve Diary. We do not share your
                                                            account information with anyone else.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <DialogFooter className="mt-8 w-full">
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={
                                                        form.formState.isSubmitting ||
                                                        form.getValues("messsage").length === 0
                                                    }
                                                >
                                                    {form.formState.isSubmitting ? (
                                                        <Spinner className="h-4 w-4" />
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FeedbackType({
    type,
    onSelect,
    isActive
}: {
    type: string;
    onSelect: any;
    isActive: boolean;
}) {
    let icon = "";
    if (type === "Bug") icon = "🐛";
    if (type === "Idea") icon = "💡";
    if (type === "Other") icon = "💬";

    return (
        <Button
            variant={isActive ? "secondary" : "outline"}
            className="flex h-fit w-full flex-col items-center justify-center gap-2 rounded-lg border p-2"
            onClick={() => {
                onSelect(type);
            }}
        >
            <p className="text-4xl">{icon}</p>
            <p className="text-foreground/60 text-md">{type}</p>
        </Button>
    );
}
