"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserProfile, useAuth, useUser } from "@clerk/nextjs";
import { ChatBubbleIcon, DotsHorizontalIcon, SunIcon } from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import {
    ArrowUpCircleIcon,
    Code2Icon,
    DollarSignIcon,
    HelpCircleIcon,
    LogOutIcon,
    MoonIcon,
    SettingsIcon,
    StarIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLogSnag } from "@logsnag/next";
import FeedbackDialog from "./feedback-dialog";
import { usePlausible } from "next-plausible";

export default function AccountDropdown() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const { setTheme, theme } = useTheme();
    const { clearUserId } = useLogSnag();
    const plausible = usePlausible();

    const [acctSettingsDialogOpen, setAcctSettingsDialogOpen] = useState(false);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-fit w-full items-center justify-between gap-3  px-1 py-1 pr-2 text-left"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                    {user?.username ? user?.username.charAt(0) : "?"}
                                </AvatarFallback>
                                <AvatarImage
                                    src={user?.imageUrl}
                                    alt={user?.username + "'s avatar"}
                                />
                            </Avatar>
                            {user?.username}
                        </div>
                        <DotsHorizontalIcon className="text-foreground/60" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => {
                                setAcctSettingsDialogOpen(true);
                            }}
                        >
                            <SettingsIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/billing">
                                <DollarSignIcon className="mr-2 h-[1rem] w-[1rem]" />
                                Billing
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2"
                            onSelect={() => {
                                setTheme(theme === "dark" ? "light" : "dark");
                            }}
                        >
                            <MoonIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <SunIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span>Toggle theme</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="https://github.com/dickeyy/diary" target="_blank">
                            <Code2Icon className="mr-2 h-[1rem] w-[1rem]" />
                            GitHub
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="https://github.com/dickeyy/diary/issues" target="_blank">
                            <HelpCircleIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Support
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setFeedbackDialogOpen(true);
                        }}
                    >
                        <ChatBubbleIcon className="mr-2 h-[1rem] w-[1rem]" />
                        Feedback
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/changelog">
                            <StarIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Changelog
                        </Link>
                    </DropdownMenuItem>
                    {user?.publicMetadata.plan === "free" && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                asChild
                                className="bg-yellow-500 text-black focus:bg-yellow-500/80 focus:text-black"
                            >
                                <Link href="/billing">
                                    <ArrowUpCircleIcon className="mr-2 h-[1rem] w-[1rem]" />
                                    Upgrade
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="focus:bg-red-500/20"
                        onSelect={() => {
                            plausible("sign_out");
                            clearUserId();
                            signOut();
                        }}
                    >
                        <LogOutIcon className="mr-2 h-[1rem] w-[1rem]" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AccountSettingsDialog
                isOpen={acctSettingsDialogOpen}
                onStateChange={setAcctSettingsDialogOpen}
            />
            <FeedbackDialog isOpen={feedbackDialogOpen} onStateChange={setFeedbackDialogOpen} />
        </>
    );
}

function AccountSettingsDialog({ isOpen, onStateChange }: { isOpen: boolean; onStateChange: any }) {
    return (
        <Dialog open={isOpen} onOpenChange={onStateChange}>
            <DialogContent className="flex w-fit max-w-full items-center justify-center p-8">
                <UserProfile routing="hash" />
            </DialogContent>
        </Dialog>
    );
}
