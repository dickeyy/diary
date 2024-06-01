"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "./ui/textarea";

export default function ContentInput({
    content,
    setContent
}: {
    content: string;
    setContent: (content: string) => void;
}) {
    const textAreaRef = useRef(null);
    // const [htmlContent, setHtmlContent] = useState(stringToHTML(content));

    // Adjust the height of the textarea to fit content
    useEffect(() => {
        if (textAreaRef.current) {
            let current: any = textAreaRef.current;
            current.style.height = "0px";
            const scrollHeight = current.scrollHeight;
            current.style.height = `${scrollHeight}px`;
        }
    }, [content]);

    return (
        <div className="flex w-full">
            <Textarea
                ref={textAreaRef}
                className="text-foreground/90 h-auto w-full resize-none overflow-hidden rounded-none border-0 p-0 font-serif text-[18px] font-light leading-loose shadow-none focus-visible:ring-0"
                value={content}
                autoFocus
                onChange={(e) => setContent(e.target.value)}
                rows={1} // Starts with a single row
                style={{ minHeight: "85vh" }}
                maxLength={20000} // Set the maximum length of the textarea to 20,000 characters (for data size)
            />
        </div>
    );
}
