import { useCallback, useEffect, useReducer } from "react";

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

type Action<T> =
    | { type: "START_FETCH" }
    | { type: "FETCH_FROM_CACHE"; payload: T }
    | { type: "FETCH_SUCCESS"; payload: T }
    | { type: "FETCH_ERROR"; payload: Error };

function reducer<T>(state: IQueryState<T>, action: Action<T>): IQueryState<T> {
    switch (action.type) {
        case "START_FETCH":
            return {
                ...state,
                isFetching: true,
                isLoading: state.data === null,
            };
        case "FETCH_FROM_CACHE":
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isFetching: false,
                error: null,
            };
        case "FETCH_SUCCESS":
            return {
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
                isFetching: false,
            };
        case "FETCH_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                isFetching: false,
            };
        default:
            return state;
    }
}

export default function useQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    staleTime: number = 10 * 60 * 1000,
): IUseQueryReturn<T> {
    const initialState: IQueryState<T> = {
        data: null,
        error: null,
        isLoading: true,
        isFetching: false,
    };

    const [state, dispatch] = useReducer(reducer<T>, initialState);

    const fetchData = useCallback(
        async (invalidateCache = false) => {
            const nowTimeStamp = Date.now();
            const cachedData = cache.get(queryKey) as IMapValue<T> | undefined;

            if (
                !invalidateCache &&
                cachedData &&
                nowTimeStamp - cachedData.timeStamp <= cachedData.staleTime
            ) {
                dispatch({
                    type: "FETCH_FROM_CACHE",
                    payload: cachedData.data,
                });
                return;
            }

            dispatch({ type: "START_FETCH" });

            try {
                const result = await queryFn();
                dispatch({ type: "FETCH_SUCCESS", payload: result });
                cache.set(queryKey, {
                    data: result,
                    timeStamp: nowTimeStamp,
                    staleTime,
                });
            } catch (err) {
                dispatch({ type: "FETCH_ERROR", payload: err as Error });
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
                        dispatch({
                            type: "FETCH_ERROR",
                            payload: err as Error,
                        });
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
