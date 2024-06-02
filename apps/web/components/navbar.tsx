"use client";

import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar({ active }: { active: "home" | "pricing" | "sign-up" | "sign-in" }) {
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    return (
        <nav className="bg-card/20 glass-blur sticky top-4 z-50 flex w-fit items-center justify-between rounded-full border p-1 shadow-md">
            <div className="flex items-center gap-1 sm:gap-2">
                <NavbarButton isActive={active === "home"}>
                    <Link href="/">About</Link>
                </NavbarButton>
                <NavbarButton isActive={active === "pricing"}>
                    <Link href="/pricing">Pricing</Link>
                </NavbarButton>

                {isSignedIn ? (
                    <NavbarButton isActive={active === "sign-in"}>
                        <Link href="/entry">
                            <div className="flex items-center justify-center gap-2">
                                Dashboard
                                <img
                                    src={user?.imageUrl}
                                    alt=""
                                    className="h-[1.1rem] w-[1.1rem] rounded-full"
                                />
                            </div>
                        </Link>
                    </NavbarButton>
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
    isActive: boolean;
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
            className="h-fit rounded-full px-4 py-1 text-[14px]"
        >
            {children}
        </Button>
    );
}
