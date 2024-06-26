"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useLogSnag } from "@logsnag/next";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, isSignedIn, isLoaded } = useUser();
    const { setUserId } = useLogSnag();

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            setUserId(user.id);
        }
    }, [isLoaded, isSignedIn, user, setUserId]);

    return (
        <>
            <SignedIn>
                {/* desktop view */}
                <div className="hidden md:grid md:grid-cols-[auto,1fr]">
                    <div className="sticky top-0 z-50 flex h-screen w-full max-w-72 items-center justify-center ">
                        <Sidebar />
                    </div>
                    <div className="flex min-h-screen w-full items-center justify-center">
                        {children}
                    </div>
                </div>

                {/* mobile view */}
                <div className="flex min-h-screen w-full items-center justify-center px-4 pb-8 md:hidden">
                    <Sidebar />
                    {children}
                </div>
            </SignedIn>
            <SignedOut>
                <div className="flex min-h-screen flex-col items-center justify-center p-12 sm:p-4">
                    <p className="text-foreground/60 mb-8 text-center">
                        Please sign in to continue
                    </p>
                    <div className="flex w-full flex-col items-center justify-center gap-2 sm:w-1/3">
                        <Button className="w-full">
                            <SignInButton />
                        </Button>
                        <Button
                            onClick={() => (window.location.href = "/")}
                            variant={"outline"}
                            className="w-full"
                        >
                            <p className="text-foreground/60 text-xs font-medium">Go home</p>
                        </Button>
                    </div>
                </div>
            </SignedOut>
        </>
    );
}
