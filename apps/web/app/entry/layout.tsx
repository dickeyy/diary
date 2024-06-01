"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SignedIn>
                <div className="flex min-h-screen items-center justify-center p-12 sm:p-4">
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
