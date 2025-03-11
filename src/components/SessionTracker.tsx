import { useEffect, useState } from "react";

import Button from "./Button";
import CircularProgress from "./CircularProgress";

export default function SessionTracker() {
    const totalSeconds = 1 * 60;
    const [elapsed, setElapsed] = useState<number>(0);
    const [message, setMessage] = useState<string>("enjoy the game");
    const [resetKey, setResetKey] = useState<number>(0);

    useEffect(() => {
        setElapsed(0);
        setMessage("enjoy the game");
        const timer = setInterval(() => {
            setElapsed((prev) => {
                if (prev >= totalSeconds) {
                    clearInterval(timer);
                    setMessage("Times up!");
                    return totalSeconds;
                }
                return prev + 1;
            });
        }, 1000);
    }, [totalSeconds, resetKey]);

    const progress = (elapsed / totalSeconds) * 100;
    const hours = Math.floor(elapsed / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor(elapsed / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");

    function handleReset() {
        setResetKey((prev) => prev + 1);
    }

    return (
        <div
            className={"flex flex-col justify-center items-center border gap-4"}
        >
            <p className={"text-xl font-medium text-on-background"}>
                {message}
            </p>
            <div className={"text-lg font-medium text-on-background"}>
                {hours}:{minutes}:{seconds} elapsed
            </div>
            <CircularProgress progress={progress} size={"large"} />
            <div className={""}>
                <Button onClick={handleReset} variant={"contained"} fullWidth>
                    Reset
                </Button>
            </div>
        </div>
    );
}
