import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';

export default function useClerkSWR(url: string) {
    const { getToken } = useAuth();

    const fetcher = async () => {
        return fetch(url, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        }).then(res => res.json());
    };

    return useSWR(url, fetcher);
}
