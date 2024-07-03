import { ClerkProvider } from "@clerk/nextjs";
import { LogSnagProvider } from "@logsnag/next";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: "dark" as any
            }}
        >
            <LogSnagProvider token={process.env.NEXT_PUBLIC_LOGSNAG_TOKEN || ""} project="diary">
                {children}
            </LogSnagProvider>
        </ClerkProvider>
    );
}
