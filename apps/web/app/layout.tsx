import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { Averia_Serif_Libre as FontSerif } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["300", "400", "700"]
});

export const metadata: Metadata = {
    metadataBase: new URL("https://diary.kyle.so"),
    title: "diary",
    description: "A private and secure place to keep track of your thoughts.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://diary.kyle.so",
        images: "/og-image.png"
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: "dark" as any
            }}
        >
            <html lang="en" suppressHydrationWarning>
                <head />

                <body
                    className={cn(
                        "bg-background min-h-screen overflow-auto font-sans antialiased",
                        fontSans.variable,
                        fontSerif.variable
                    )}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster richColors={true} />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
