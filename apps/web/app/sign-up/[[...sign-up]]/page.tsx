"use client";

import { SignUp } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        posthog.capture("sign_up");
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <SignUp />
        </div>
    );
}
