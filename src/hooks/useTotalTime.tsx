import { useEffect, useState } from "react";

export function useTotalTime(fetcher: () => Promise<number>) {
    const [totalTime, setTotalTime] = useState<number>();

    useEffect(() => {
        (async () => {
            const time = await fetcher();
            setTotalTime(time);
        })();
    }, [fetcher]);

    return totalTime;
}
