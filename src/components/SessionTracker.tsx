import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import CircularProgress from "./CircularProgress";

type TimerStatus = "idle" | "running" | "paused" | "ended";

export default function SessionTracker() {
    const totalSeconds = 1 * 60;
    const [elapsed, setElapsed] = useState<number>(0);
    const [message, setMessage] = useState<string>("enjoy the game");
    const [status, setStatus] = useState<TimerStatus>("idle");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const remainingTime = totalSeconds - elapsed;
    const progress = (elapsed / totalSeconds) * 100;
    const hours = Math.floor(remainingTime / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((remainingTime % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (remainingTime % 60).toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;

    useEffect(() => {
        if (status !== "running") return;

        timerRef.current = setInterval(() => {
            setElapsed((prev) => {
                if (prev >= totalSeconds) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    setMessage("Times up!");
                    setStatus("ended");
                    return totalSeconds;
                }
                return prev + 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [status, totalSeconds]);

    function handleStart() {
        // send a notification if total limit reached
        setElapsed(0);
        setMessage("Enjoy the game!");
        setStatus("running");
    }

    function handleStop() {
        setStatus("paused");
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    function handleContinue() {
        setStatus("running");
    }

    function handleEnd() {
        setStatus("ended");
        setMessage("Times up!");
        setElapsed(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        // send notification
        // save session data to db
    }

    return (
        <div className={"flex flex-col justify-center items-center gap-8"}>
            <p className={"text-2xl font-medium text-on-background"}>
                {message}
            </p>
            <CircularProgress
                progress={progress}
                text={timeString}
                size={"large"}
            />
            <div className={"flex flex-col gap-4"}>
                {(status === "idle" || status === "ended") && (
                    <Button
                        onClick={handleStart}
                        variant={"contained"}
                        size={"medium"}
                    >
                        Start
                    </Button>
                )}
                {status === "running" && (
                    <Button
                        onClick={handleStop}
                        variant={"contained"}
                        size={"medium"}
                    >
                        Stop
                    </Button>
                )}
                {status === "paused" && (
                    <>
                        <Button
                            onClick={handleContinue}
                            variant={"contained"}
                            size={"medium"}
                        >
                            Continue
                        </Button>
                        <Button
                            onClick={handleEnd}
                            variant={"outlined"}
                            size={"medium"}
                        >
                            End
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
