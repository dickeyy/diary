"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
            <Card className="bg-card/80">
                <CardHeader>
                    <CardTitle className="font-serif text-2xl font-[700]">
                        Something went wrong.
                    </CardTitle>
                    <CardDescription>{error.message}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button asChild variant="default" className="w-full">
                        <a href="/">Go back home</a>
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                            reset();
                        }}
                    >
                        Retry
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-foreground/60 font-mono text-sm">Error Code: 500</p>
                </CardFooter>
            </Card>
        </main>
    );
}
