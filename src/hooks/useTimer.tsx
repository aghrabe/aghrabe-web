import { useReducer, useEffect, useRef, RefObject } from "react";
import {
    TimerContextState,
    TimerControlActions,
    TimerStatus,
} from "../lib/types/timer";
import timerReducer from "../lib/reducers/timerReducer";

export default function useTimer(totalSeconds: number): TimerContextState &
    TimerControlActions & {
        timerRef: RefObject<NodeJS.Timeout | null>;
        timeString: string;
        progress: number;
        remainingTime: number;
    } {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [state, dispatch] = useReducer(timerReducer, {
        elapsed: 0,
        status: "idle",
    });

    const { elapsed, status } = state;

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
        if (storedElapsed || storedStatus) {
            dispatch({
                type: "RESET",
                payload: {
                    elapsed: storedElapsed ? parseInt(storedElapsed, 10) : 0,
                    status: storedStatus || "idle",
                },
            });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("sessionElapsed", elapsed.toString());
        localStorage.setItem("sessionStatus", status);
    }, [elapsed, status]);

    useEffect(() => {
        if (status !== "running") {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        timerRef.current = setInterval(() => {
            dispatch({ type: "INCREMENT" });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [status, totalSeconds]);

    useEffect(() => {
        if (elapsed >= totalSeconds && status === "running") {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            dispatch({ type: "SET_ELAPSED", payload: totalSeconds });
            dispatch({ type: "SET_STATUS", payload: "wantToEnd" });
        }
    }, [elapsed, totalSeconds, status]);

    function resetToIdle() {
        dispatch({ type: "SET_STATUS", payload: "idle" });
    }

    function prepareForStart() {
        dispatch({ type: "SET_STATUS", payload: "wantToStart" });
    }

    function prepareForEnd() {
        dispatch({ type: "SET_STATUS", payload: "wantToEnd" });
    }

    function beginTimer() {
        dispatch({ type: "RESET", payload: { elapsed: 0, status: "running" } });
    }

    function pauseTimer() {
        dispatch({ type: "SET_STATUS", payload: "paused" });
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    function resumeTimer() {
        dispatch({ type: "SET_STATUS", payload: "running" });
    }

    function endTimer() {
        dispatch({ type: "RESET", payload: { elapsed: 0, status: "ended" } });
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        localStorage.removeItem("sessionElapsed");
        localStorage.removeItem("sessionStatus");
    }

    return {
        elapsed,
        updateElapsedTime: (elapsed: number) =>
            dispatch({ type: "SET_ELAPSED", payload: elapsed }),
        status,
        timeString,
        progress,
        remainingTime,
        timerRef,
        resetToIdle,
        prepareForStart,
        prepareForEnd,
        beginTimer,
        pauseTimer,
        resumeTimer,
        endTimer,
    };
}
