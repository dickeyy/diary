import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getPolicyData } from "@/lib/md-processor";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata | null> {
    return {
        title: "Diary - privacy policy"
    };
}

export default async function Page() {
    const data = await getPolicyData("privacy");

    if (!data) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Navbar />
            <div
                className={
                    "text-foreground my-10 mt-12 flex w-full flex-1 flex-col items-start sm:mt-0 sm:w-3/4"
                }
            >
                <article className="mb-8 flex w-full flex-col p-4 sm:mt-8">
                    <section
                        className="blog-content gap-4"
                        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                    />
                </article>
            </div>
            <Footer />
        </div>
    );
}
