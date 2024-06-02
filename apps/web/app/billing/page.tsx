"use client";

import Spinner from "@/components/ui/spinner";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Upgrade() {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();

    const [madeRequest, setMadeRequest] = useState(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user && !madeRequest) {
            if (user.publicMetadata.stripeCustomerId) {
                setMadeRequest(true);
                getPortalLink(user?.publicMetadata.stripeCustomerId as any).then((res) => {
                    if (res.url) {
                        window.location.href = res.url;
                    }
                });
            }
        }
    }, [isSignedIn, isLoaded, user, madeRequest]);

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <p className="text-foreground/60 mb-4 text-center text-sm">
                Please wait while we redirect you to Stripe.
            </p>
            <Spinner className=" h-8 w-8" />
        </div>
    );
}

function getPortalLink(customerID: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/portal/${customerID}`).then((res) =>
        res.json()
    );
}
