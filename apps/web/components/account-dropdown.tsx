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
import { DotsHorizontalIcon, SunIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import {
    ArrowUpCircleIcon,
    ArrowUpIcon,
    Code2Icon,
    DollarSignIcon,
    HelpCircleIcon,
    LogOutIcon,
    MoonIcon,
    SettingsIcon,
    SparkleIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import posthog from "posthog-js";
import { redirect } from "next/navigation";

export default function AccountDropdown() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const { setTheme, theme } = useTheme();

    const [acctSettingsDialogOpen, setAcctSettingsDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-fit w-full items-center justify-between gap-3 px-1 py-1 text-left"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <img src={user?.imageUrl} alt="" className="h-6 w-6 rounded" />
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

function getPortalLink(customerID: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/portal/${customerID}`).then((res) =>
        res.json()
    );
}
