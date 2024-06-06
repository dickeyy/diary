"use client";

import { Button } from "@/components/ui/button";
import { UserProfile, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChatBubbleIcon, SunIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import {
    ArrowUpCircleIcon,
    Code2Icon,
    DollarSignIcon,
    HelpCircleIcon,
    LogOutIcon,
    MoonIcon,
    SettingsIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import posthog from "posthog-js";
import { useLogSnag } from "@logsnag/next";
import FeedbackDialog from "./feedback-dialog";

export default function Navbar({
    active
}: {
    active?: "home" | "pricing" | "sign-up" | "sign-in";
}) {
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    return (
        <nav className="bg-card/20 glass-blur sticky top-4 z-50 flex w-fit items-center justify-between rounded-full border p-1 shadow-md">
            <div className="flex items-center gap-1 sm:gap-2">
                <NavbarButton isActive={active === "home"}>
                    <Link href="/home">About</Link>
                </NavbarButton>
                <NavbarButton isActive={active === "pricing"}>
                    <Link href="/pricing">Pricing</Link>
                </NavbarButton>

                {isSignedIn ? (
                    <>
                        <NavbarButton>
                            <Link href="/entry">Write</Link>
                        </NavbarButton>
                        <AccountDropdown user={user} />
                    </>
                ) : (
                    <>
                        <NavbarButton isActive={active === "sign-in"}>
                            <Link href="/sign-in">Sign in</Link>
                        </NavbarButton>
                        <NavbarButton highlight isActive={active === "sign-up"}>
                            <Link href="/sign-up">Get Started</Link>
                        </NavbarButton>
                    </>
                )}
            </div>
        </nav>
    );
}

function NavbarButton({
    children,
    isActive,
    highlight
}: {
    children: React.ReactNode;
    isActive?: boolean;
    highlight?: boolean;
}) {
    let variant = "ghost";
    if (highlight) {
        variant = "default";
    }
    if (isActive) {
        variant = "secondary";
    }
    return (
        <Button
            variant={variant as any}
            asChild
            className={`h-fit rounded-full px-4 py-1 text-[14px]
                ${isActive ? "font-serif text-[14px] font-[700]" : ""}
            `}
        >
            {children}
        </Button>
    );
}

function AccountDropdown({ user }: { user: any }) {
    const { signOut } = useAuth();
    const { setTheme, theme } = useTheme();
    const { clearUserId } = useLogSnag();

    const [acctSettingsDialogOpen, setAcctSettingsDialogOpen] = useState(false);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-fit w-full items-center justify-between gap-3  rounded-full py-1 pl-1 pr-4 text-left"
                    >
                        <div className="flex flex-row items-center justify-center gap-2">
                            <Avatar className="h-5 w-5">
                                <AvatarFallback>
                                    {user?.username ? user?.username.charAt(0) : "?"}
                                </AvatarFallback>
                                <AvatarImage
                                    src={user?.imageUrl}
                                    alt={user?.username + "'s avatar"}
                                />
                            </Avatar>
                            <p className="text-[14px]">{user?.username}</p>
                        </div>
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
                            posthog.capture("sign_out");
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
