import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useSessions from "../hooks/useSessions";
import useSettings from "../hooks/useSettings";
import { CreateSessionDto, UpdateSessionDto } from "../lib/types/sessions";
import { useAuthContext } from "./AuthContext";
import ContextGenerator from "./ContextGenerator";
import { useCurrentGameContext } from "./CurrentGameContext";

type TimerStatus =
    | "idle"
    | "wantToStart"
    | "running"
    | "paused"
    | "wantToEnd"
    | "ended";

interface CurrentSessionContextType {
    elapsed: number;
    message: string;
    status: TimerStatus;
    totalSeconds: number;
    remainingTime: number;
    progress: number;
    timeString: string;
    settingsShouldChange: boolean;
    setSettingsShouldChange: Dispatch<SetStateAction<boolean>>;
    handleGetBackToIdle: () => void;
    handleStatusOnStart: () => void;
    startSession: () => void;
    stopSession: () => void;
    continueSession: () => void;
    endSession: () => void;
    createSession: () => void;
    updateCurrentSession: () => void;
}

const { Provider, useContextValue: useCurrentSession } =
    ContextGenerator<CurrentSessionContextType>("CurrentSession");

export function CurrentSessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthContext();
    const { currentGame, setCurrentGame } = useCurrentGameContext();
    const { settingsState, refetch } = useSettings();
    const { addSession, updateSession } = useSessions();
    const [createdSessionID, setCreatedSessionID] = useState<string | null>(
        null,
    );
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [startTimeState, setStartTimeState] = useState<string>("");
    const [elapsed, setElapsed] = useState<number>(0);
    const [message, setMessage] = useState<string>(
        "Wanna Start a New Session?",
    );
    const [status, setStatus] = useState<TimerStatus>("idle");
    const [totalSeconds, setTotalSeconds] = useState<number>(50 * 60);
    const [settingsShouldChange, setSettingsShouldChange] =
        useState<boolean>(false);

    useEffect(() => {
        if (settingsShouldChange) {
            refetch(true);
            setSettingsShouldChange(false);
        }
    }, [settingsShouldChange, refetch]);

    useEffect(() => {
        if (settingsState.data?.session_limit_minutes) {
            setTotalSeconds(settingsState.data.session_limit_minutes * 60);
        }
    }, [settingsState.data?.session_limit_minutes]);

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
            setElapsed(parseInt(storedElapsed, 10));
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
                    setMessage("Time's up!");
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

    function handleGetBackToIdle() {
        setStatus("idle");
    }

    function handleStatusOnStart() {
        setStatus("wantToStart");
    }

    function startSession() {
        // TODO: send a notification if total limit reached and don't allow the startSession process
        setElapsed(0);
        setMessage(`Enjoy Playing ${currentGame?.title}!`);
        setStatus("running");

        createSession();
    }

    function stopSession() {
        setStatus("paused");
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    function continueSession() {
        setStatus("running");
    }

    function endSession() {
        setStatus("ended");
        setMessage("Time's up!");
        setElapsed(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        localStorage.removeItem("sessionElapsed");
        localStorage.removeItem("sessionStatus");
        // TODO: send notification
        // TODO: save session data to db

        updateCurrentSession();
    }

    async function createSession() {
        if (!user) {
            alert("unAuthorized");
            return;
        }

        if (!currentGame) {
            alert("select a game");
            return;
        }

        const startTime = new Date().toISOString();

        const sessionData: CreateSessionDto = {
            user_id: user.id,
            game_id: currentGame.id,
            start_time: startTime,
            end_time: null,
        };

        setStartTimeState(startTime);
        console.log("Session created:", sessionData);

        const result = await addSession(sessionData);
        if (!result) {
            console.error("Creating session failed");
            return;
        }
        setCreatedSessionID(result);
    }

    async function updateCurrentSession() {
        if (!user) {
            alert("unAuthorized");
            return;
        }

        if (!currentGame) {
            alert("select a game");
            return;
        }

        const sessionData: Partial<UpdateSessionDto> = {
            user_id: user.id,
            game_id: currentGame.id,
            start_time: startTimeState,
            end_time: new Date().toISOString(),
            duration_minutes:
                Math.floor(elapsed / 60) === 0
                    ? undefined
                    : Math.floor(elapsed / 60),
        };

        console.log("triggering update row");

        await updateSession(createdSessionID!, sessionData);

        console.log("Session updated:", sessionData);

        setStartTimeState("");
        setCurrentGame(null);
    }

    return (
        <Provider
            value={{
                elapsed,
                message,
                status,
                totalSeconds,
                remainingTime,
                progress,
                timeString,
                settingsShouldChange,
                setSettingsShouldChange,
                handleGetBackToIdle,
                handleStatusOnStart,
                startSession,
                stopSession,
                continueSession,
                endSession,
                createSession,
                updateCurrentSession,
            }}
        >
            {children}
        </Provider>
    );
}

export { useCurrentSession };
