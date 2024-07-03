"use client";

import Link from "next/link";
import GitHubIcon from "@/public/icons/github.svg";
import TwitterIcon from "@/public/icons/twitter.svg";
import { usePlausible } from "next-plausible";

export default function Footer() {
    const plausible = usePlausible();
    return (
        <footer className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="text-foreground/60 text-xs font-normal">
                © {new Date().getFullYear()}{" "}
                <Link
                    href="https://kyle.so"
                    target="_blank"
                    className="hover:text-foreground transition-colors duration-150 hover:underline"
                    onClick={() => plausible("footer_portfolio_link_click")}
                >
                    Kyle Dickey
                </Link>
            </p>
            <div className="flex flex-row items-center gap-4">
                <Link
                    href="/privacy"
                    className="hover:text-foreground text-foreground/60 text-xs font-normal transition-colors duration-150 hover:underline"
                    onClick={() => plausible("footer_privacy_click")}
                >
                    Privacy
                </Link>
                <Link
                    href="/terms"
                    className="hover:text-foreground text-foreground/60 text-xs font-normal transition-colors duration-150 hover:underline"
                    onClick={() => plausible("footer_terms_click")}
                >
                    Terms
                </Link>
                <Link
                    href="https://github.com/dickeyy/diary"
                    target="_blank"
                    onClick={() => plausible("footer_github_link_click")}
                >
                    <GitHubIcon className="fill-foreground/60 hover:fill-foreground h-4 w-4 transition-colors duration-150" />
                </Link>
                <Link
                    href="https://twitter.com/kyledickeyy"
                    target="_blank"
                    onClick={() => plausible("footer_twitter_link_click")}
                >
                    <TwitterIcon className="fill-foreground/60 hover:fill-foreground h-4 w-4 transition-colors duration-150" />
                </Link>
            </div>
        </footer>
    );
}
