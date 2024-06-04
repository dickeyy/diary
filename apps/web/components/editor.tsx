"use client";

import { useRef } from "react";
import { Plate, PlateContent } from "@udecode/plate-common";

export default function Editor({
    content,
    setContent,
    isBlured
}: {
    content: string;
    setContent: (content: string) => void;
    isBlured: boolean;
}) {
    const editorRef = useRef(null);

    return (
        <Plate
            initialValue={content ? JSON.parse(content) : undefined}
            onChange={(value) => {
                setContent(JSON.stringify(value));
            }}
        >
            <PlateContent
                ref={editorRef}
                className={`w-full border-0 p-0 font-serif text-[18px] font-light leading-loose shadow-none focus:outline-none focus-visible:border-0 focus-visible:ring-0
                    ${isBlured ? "blur-[8px]" : ""}
                `}
            />
        </Plate>
        // <div className="flex w-full">
        //     <Textarea
        //         ref={textAreaRef}
        //         className={`text-foreground/90 h-auto w-full resize-none overflow-hidden rounded-none border-0 p-0 font-serif text-[18px] font-light leading-loose shadow-none focus-visible:ring-0
        //             ${isBlured ? "blur-[8px]" : ""}
        //         `}
        //         value={content}
        //         autoFocus
        //         onChange={(e) => setContent(e.target.value)}
        //         rows={1} // Starts with a single row
        //         style={{ minHeight: "84vh" }}
        //         maxLength={20000} // Set the maximum length of the textarea to 20,000 characters (for data size)
        //     />
        // </div>
    );
}
