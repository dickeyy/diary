import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { Averia_Serif_Libre as FontSerif } from "next/font/google";
import { JetBrains_Mono as FontMono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import PHProvider from "@/components/posthog-provider";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["300", "400", "700"]
});

const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
    metadataBase: new URL("https://diary.kyle.so"),
    title: "Diary - diary.kyle.so",
    description: "A private and secure place to keep track of your thoughts.",

    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://diary.kyle.so",
        images: "/og-image.png",
        siteName: "Diary",
        title: "Diary - diary.kyle.so",
        description: "A private and secure place to keep track of your thoughts."
    },
    twitter: {
        card: "summary_large_image",
        site: "@kyledickeyy",
        creator: "@kyledickeyy",
        title: "Diary - diary.kyle.so",
        description: "A private and secure place to keep track of your thoughts.",
        images: "/og-image.png"
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-icon.png"
    },
    keywords: [
        "diary",
        "kyle",
        "diary.kyle.so",
        "diary.kyle.so",
        "open source",
        "privacy",
        "security",
        "journal",
        "thoughts",
        "journaling",
        "personal",
        "self-care",
        "self-reflection",
        "mindfulness",
        "mental health",
        "mental wellness",
        "mental health",
        "wellness"
    ],
    alternates: {
        canonical: "https://diary.kyle.so",
        languages: {
            "en-US": "https://diary.kyle.so/"
        }
    },
    robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1
    },
    authors: [{ name: "Kyle", url: "https://kyle.so" }],
    publisher: "Kyle"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: "dark" as any
            }}
        >
            <PHProvider>
                <html lang="en" suppressHydrationWarning>
                    <head />

                    <body
                        className={cn(
                            "bg-background min-h-screen overflow-auto font-sans antialiased",
                            fontSans.variable,
                            fontSerif.variable,
                            fontMono.variable
                        )}
                    >
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster richColors={true} position="top-right" />
                        </ThemeProvider>
                    </body>
                </html>
            </PHProvider>
        </ClerkProvider>
    );
}
