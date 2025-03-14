import { useCallback, useEffect, useState } from "react";

interface IQueryState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isFetching: boolean;
}

interface IMapValue<T> {
    data: T;
    timeStamp: number;
    staleTime: number;
}

interface IUseQueryReturn<T> {
    state: IQueryState<T>;
    refetch: (invalidateCache?: boolean) => Promise<void>;
    clearCache: (key: string) => void;
}

const cache = new Map<string, IMapValue<unknown>>();

/**
 * A custom React hook for fetching and caching data with automatic retries, stale time management, and cache invalidation.
 *
 * @template T The type of data returned by the query function.
 * @param {string} queryKey A unique key for identifying the cached data.
 * @param {() => Promise<T>} queryFn An asynchronous function that fetches the data.
 * @param {number} [staleTime=600000] The duration (in milliseconds) before cached data is considered stale. Default is 10 minutes.
 * @returns {IUseQueryReturn<T>} An object containing the query state, a refetch function, and a cache clearing function.
 *
 * @example
 *```typescript
 * // Basic usage
 * const { state, refetch, clearCache } = useQuery("userData", fetchUserData, 5 * 60 * 1000);
 *
 * console.log(state.data); // Retrieved user data
 * console.log(state.isLoading); // Indicates if the query is loading
 *
 * // Manually refetching data and invalidating cache
 * await refetch(true);
 *
 * // Clearing the cache for a specific query
 * clearCache("userData");
 * ```
 */
export default function useQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    staleTime: number = 10 * 60 * 1000, // Default: 10 minutes
): IUseQueryReturn<T> {
    const [state, setState] = useState<IQueryState<T>>({
        data: null,
        error: null,
        isLoading: true,
        isFetching: false,
    });

    const fetchData = useCallback(
        async (invalidateCache = false) => {
            const nowTimeStamp = Date.now();
            const cachedData = cache.get(queryKey) as IMapValue<T> | undefined;

            if (
                !invalidateCache &&
                cachedData &&
                nowTimeStamp - cachedData.timeStamp <= cachedData.staleTime
            ) {
                setState((prev) => ({
                    ...prev,
                    data: cachedData.data,
                    isLoading: false,
                    isFetching: false,
                }));
                return;
            }

            setState((prev) => ({
                ...prev,
                isFetching: true,
                isLoading: prev.data === null,
            }));

            try {
                const result = await queryFn();

                setState({
                    data: result,
                    error: null,
                    isLoading: false,
                    isFetching: false,
                });

                cache.set(queryKey, {
                    data: result,
                    timeStamp: nowTimeStamp,
                    staleTime,
                });
            } catch (err) {
                setState((prev) => ({
                    ...prev,
                    error: err as Error,
                    isLoading: false,
                    isFetching: false,
                }));
            }
        },
        [queryKey, queryFn, staleTime],
    );

    const fetchDataWithRetry = useCallback(
        async (invalidateCache = false) => {
            let retries = 3;
            while (retries > 0) {
                try {
                    await fetchData(invalidateCache);
                    return;
                } catch (err) {
                    retries--;
                    if (retries === 0) {
                        setState((prev) => ({
                            ...prev,
                            error: err as Error,
                            isLoading: false,
                            isFetching: false,
                        }));
                    } else {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000),
                        );
                    }
                }
            }
        },
        [fetchData],
    );

    const clearCache = useCallback((key: string) => {
        cache.delete(key);
    }, []);

    useEffect(() => {
        fetchDataWithRetry();
    }, [fetchDataWithRetry]);

    return { state, refetch: fetchDataWithRetry, clearCache };
}
