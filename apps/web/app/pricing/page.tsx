import Footer from "@/components/footer";
import Navbar from "../../components/navbar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StripeClimateIcon from "@/public/icons/stripe-climate.svg";
import { Metadata } from "next";
import ProductHuntEmbed from "@/components/product-hunt-embed";

export async function generateMetadata(): Promise<Metadata | null> {
    return {
        title: "Diary Pricing"
    };
}

export default function Pricing() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Navbar active="pricing" />
            <div className="mt-20 flex flex-1 flex-grow flex-col items-start justify-center gap-4 px-4 pb-4 text-left">
                <h1 className="text-left font-serif text-5xl font-extrabold">
                    Clear & transparent pricing
                </h1>
                <p className="text-foreground/60 text-left">
                    Our pricing is simple and easy to understand. Diary is free for everyone, but if
                    you want to support us, you can.
                </p>

                <div className="mt-8 flex  w-full flex-col items-center justify-center gap-4 sm:flex-row">
                    <PricingCard
                        title="Starter"
                        price="Free"
                        interval="forever"
                        description="For the the common user."
                        features={[
                            "Unlimited entries",
                            "1 daily entry limit",
                            "Blur content on command",
                            "Private and secure",
                            "Export to .txt - Coming soon"
                        ]}
                        href="/sign-up"
                    />
                    <PricingCard
                        title="Plus"
                        price="$4.99"
                        highlight
                        interval="/month"
                        description="For the cool user."
                        features={[
                            "Everything in the starter plan",
                            "Unlimited daily entries",
                            "Edit entry titles",
                            "Export to .pdf - Coming soon",
                            "Toggleable entry lock - Coming soon"
                        ]}
                        href="/upgrade"
                    />
                </div>

                <div className="mt-4 flex flex-row items-center justify-center gap-2">
                    <StripeClimateIcon className="h-4 w-4" />

                    <p className="text-foreground/60 text-left text-xs">
                        1% of every transaction is contributed to removing CO
                        <span className="text-[8px]">2</span> from the atmosphere.{" "}
                        <Link
                            href="https://climate.stripe.com/5I6UwT"
                            target="_blank"
                            className="hover:text-foreground underline transition-colors duration-150"
                        >
                            Learn More.
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function PricingCard({
    title,
    price,
    description,
    highlight,
    interval,
    features,
    href
}: {
    title: string;
    price: string;
    description: string;
    highlight?: boolean;
    interval: string;
    features: string[];
    href: string;
}) {
    return (
        <Card
            className={`bg-card/80 w-full
            ${highlight ? "ring-foreground ring-offset-background ring-2 ring-offset-2" : ""}
        `}
        >
            <CardHeader>
                <CardTitle className="text-foreground/60 font-serif text-xl font-extrabold">
                    {title}
                </CardTitle>
                <p className="font-serif text-4xl font-[700]">
                    {price} <span className="text-foreground/60 text-lg">{interval}</span>
                </p>
                <CardDescription className="text-foreground/60 font-light">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80 font-light">Features</p>
                <ul className="list-inside list-disc">
                    {features.map((feature, index) => (
                        <li className="text-foreground/60 font-light" key={index + feature}>
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button className="w-full" variant={highlight ? "default" : "secondary"} asChild>
                    <Link href={href}>Get started</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
