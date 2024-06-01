import Link from "next/link";
import GitHubIcon from "@/public/icons/github.svg";
import TwitterIcon from "@/public/icons/twitter.svg";
import posthog from "posthog-js";

export default function Footer() {
    return (
        <footer className="absolute bottom-0 flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="text-foreground/60 text-xs font-medium">
                © {new Date().getFullYear()}{" "}
                <Link
                    href="https://kyle.so"
                    target="_blank"
                    className="hover:text-foreground transition-colors duration-150 hover:underline"
                    onClick={() => posthog.capture("footer_portfolio_link_click")}
                >
                    Kyle Dickey
                </Link>
            </p>
            <div className="flex flex-row items-center gap-4">
                <Link
                    href="https://github.com/dickeyy/diary"
                    target="_blank"
                    onClick={() => posthog.capture("footer_github_link_click")}
                >
                    <GitHubIcon className="fill-foreground/60 hover:fill-foreground h-4 w-4 transition-colors duration-150" />
                </Link>
                <Link
                    href="https://twitter.com/kyledickeyy"
                    target="_blank"
                    onClick={() => posthog.capture("footer_twitter_link_click")}
                >
                    <TwitterIcon className="fill-foreground/60 hover:fill-foreground h-4 w-4 transition-colors duration-150" />
                </Link>
            </div>
        </footer>
    );
}
