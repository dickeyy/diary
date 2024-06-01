"use client";

import { SignIn } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        posthog.capture("sign_in");
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <SignIn />
        </div>
    );
}
