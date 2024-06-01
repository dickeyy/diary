import { DocumentType } from "@/types/Document";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DocumentState {
    documents: DocumentType[];
    selectedDocument: DocumentType | null;
}

const useDocumentStore = create<DocumentState>()(
    devtools(
        persist(
            (set) => ({
                documents: [],
                selectedDocument: null
            }),
            {
                name: "document-storage"
            }
        )
    )
);

export default useDocumentStore;
