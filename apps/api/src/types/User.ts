export type UserType = {
    id: string;
    email: string;
    image_url: string | null;
    username: string;
    created_at: number;
    updated_at: number;
    stripe_customer_id?: string;
};
