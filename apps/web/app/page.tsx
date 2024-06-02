"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import posthog from "posthog-js";
import { useEffect } from "react";
import Navbar from "../components/navbar";

export default function Page() {
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn && isLoaded) {
            posthog.capture("home_page_authed_redirect");
            redirect("/entry");
        }
    }, [isSignedIn, isLoaded]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center overflow-y-hidden ">
            <Navbar active="home" />
            <div className="flex w-full max-w-[35rem] flex-1 flex-grow flex-col items-center justify-center gap-4 px-4">
                <h1 className="text-center font-serif text-5xl font-extrabold">
                    Diary<span className="text-foreground/20 text-[18px] italic">.</span>
                    <Link
                        href="https://kyle.so"
                        target="_blank"
                        className="text-foreground/20 hover:text-foreground text-[18px] italic transition-all duration-150 hover:underline"
                        onClick={() => posthog.capture("home_page_portfolio_link_click")}
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
                        <Link href="/sign-up">Get Started</Link>
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
