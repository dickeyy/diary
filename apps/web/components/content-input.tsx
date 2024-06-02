"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "./ui/textarea";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

export default function ContentInput({
    content,
    setContent,
    isBlured,
    setIsBlured
}: {
    content: string;
    setContent: (content: string) => void;
    isBlured: boolean;
    setIsBlured: (isBlured: boolean) => void;
}) {
    const textAreaRef = useRef(null);
    // const [htmlContent, setHtmlContent] = useState(stringToHTML(content));

    // const editor = useEditor({
    //     extensions: [StarterKit],
    //     content,
    //     onUpdate: ({ editor }) => {
    //         setContent(editor.getHTML());
    //     }
    // });

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
                className={`text-foreground/90 h-auto w-full resize-none overflow-hidden rounded-none border-0 p-0 font-serif text-[18px] font-light leading-loose shadow-none focus-visible:ring-0
                    ${isBlured ? "blur-[8px]" : ""}
                `}
                value={content}
                autoFocus
                onChange={(e) => setContent(e.target.value)}
                rows={1} // Starts with a single row
                style={{ minHeight: "84vh" }}
                maxLength={20000} // Set the maximum length of the textarea to 20,000 characters (for data size)
            />
        </div>
        // <EditorContent
        //     editor={editor}
        //     className="focus-visible:ring-ring min-h-[84vh] w-full font-serif text-[18px] font-light leading-loose shadow-none focus:border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-2"
        //     autoFocus
        // />
    );
}
