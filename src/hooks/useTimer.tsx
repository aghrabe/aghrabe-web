import { RefObject, useEffect, useRef, useState } from "react";

export type TimerStatus =
    | "idle"
    | "wantToStart"
    | "running"
    | "paused"
    | "wantToEnd"
    | "ended";

export interface TimerState {
    elapsed: number;
    status: TimerStatus;
    remainingTime: number;
    progress: number;
    timeString: string;
}

export interface TimerActions {
    setElapsed: (elapsed: number | ((prev: number) => number)) => void;
    setStatus: (status: TimerStatus) => void;
    handleGetBackToIdle: () => void;
    handleStatusOnStart: () => void;
    handleStatusOnEnd: () => void;
    startTimer: () => void;
    stopTimer: () => void;
    continueTimer: () => void;
    endTimer: () => void;
}

export default function useTimer(
    totalSeconds: number,
): TimerState & TimerActions & { timerRef: RefObject<NodeJS.Timeout | null> } {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [status, setStatus] = useState<TimerStatus>("idle");

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
        const storedElapsed = localStorage.getItem("sessionElapsed");
        const storedStatus = localStorage.getItem(
            "sessionStatus",
        ) as TimerStatus;
        if (storedElapsed) {
            setElapsed(Number.parseInt(storedElapsed, 10));
        }
        if (storedStatus) {
            setStatus(storedStatus);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("sessionElapsed", elapsed.toString());
        localStorage.setItem("sessionStatus", status);
    }, [elapsed, status]);

    useEffect(() => {
        if (status !== "running") return;
        timerRef.current = setInterval(() => {
            setElapsed((prev) => {
                if (prev >= totalSeconds) {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    handleStatusOnEnd();
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

    function handleGetBackToIdle() {
        setStatus("idle");
    }

    function handleStatusOnStart() {
        setStatus("wantToStart");
    }

    function handleStatusOnEnd() {
        setStatus("wantToEnd");
    }

    function startTimer() {
        setElapsed(0);
        setStatus("running");
    }

    function stopTimer() {
        setStatus("paused");
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    function continueTimer() {
        setStatus("running");
    }

    function endTimer() {
        setStatus("ended");
        setElapsed(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        localStorage.removeItem("sessionElapsed");
        localStorage.removeItem("sessionStatus");
    }

    return {
        elapsed,
        status,
        timeString,
        progress,
        remainingTime,
        setElapsed,
        setStatus,
        timerRef,
        handleStatusOnEnd,
        handleGetBackToIdle,
        handleStatusOnStart,
        startTimer,
        stopTimer,
        continueTimer,
        endTimer,
    };
}
