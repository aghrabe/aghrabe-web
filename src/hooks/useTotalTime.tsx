import { useEffect, useState } from "react";

export function useTotalTime(fetcher: () => Promise<number>) {
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const time = await fetcher();
            setTotalTime(time);
            setIsLoading(false);
        })();
    }, [fetcher]);

    return { totalTime, isLoading };
}
