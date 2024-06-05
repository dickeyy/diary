export type DocumentType = {
    id: string;
    owner_id: string;
    title: string;
    content: string;
    created_at: number;
    updated_at: number;
    metadata: {
        font: string;
        font_size: number;
    };
};
