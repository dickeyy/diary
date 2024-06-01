"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn && isLoaded) {
            redirect("/entry");
        }
    }, [isSignedIn, isLoaded]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center overflow-y-hidden p-4 sm:p-12">
            <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4">
                <h1 className="text-center font-serif text-5xl font-extrabold">
                    Diary<span className="text-foreground/20 text-[18px] italic">.</span>
                    <Link
                        href="https://kyle.so"
                        target="_blank"
                        className="text-foreground/20 hover:text-foreground text-[18px] italic transition-all duration-150 hover:underline"
                    >
                        kyle.so
                    </Link>
                </h1>
                <p className="text-foreground/60 text-center text-sm">
                    A private place to keep track of your thoughts. <br />
                    All entries are encrypted at rest and in transit.
                </p>

                <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button className="w-full" asChild>
                        <Link href="/sign-up">Get started</Link>
                    </Button>
                    <Button variant={"outline"} className="w-full" asChild>
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
