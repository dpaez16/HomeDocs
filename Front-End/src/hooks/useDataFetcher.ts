import { useEffect, useState } from 'react';

export function useDataFetcher<T>(fetcher: () => Promise<T>) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);

    const refetch = () => {
        setLoading(true);
        setData(undefined);
        setError(undefined);

        fetcher()
            .then((resData: T) => setData(resData))
            .catch((err: Error) => setError(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            setData(undefined);
            setError(undefined);

            fetcher()
                .then((resData: T) => setData(resData))
                .catch((err: Error) => setError(err))
                .finally(() => setLoading(false));
        };

        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch,
    };
};
