import { useEffect, useState } from "react";

import ProgressBar from "./ProgressBar";
import CircularProgress from "./CircularProgress";
import Button from "./Button";

export default function SessionTracker() {
    const totalSeconds = 2 * 60;
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
    const minutes = Math.floor(elapsed / 60);
    const seconds = (elapsed % 60).toString().padStart(2, "0");

    function handleReset() {
        setResetKey((prev) => prev + 1);
    }

    return (
        <>
            <div>SessionTracker</div>
            <div className={"text-lg font-medium text-on-background"}>
                {message}
            </div>
            <div className={"text-lg font-medium text-on-background"}>
                {minutes}:{seconds} elapsed
            </div>
            <ProgressBar progress={progress} />
            <CircularProgress progress={progress} size={400} />
            <div className={"mt-4"}>
                <Button onClick={handleReset} variant={"contained"} fullWidth>
                    Reset
                </Button>
            </div>
        </>
    );
}
