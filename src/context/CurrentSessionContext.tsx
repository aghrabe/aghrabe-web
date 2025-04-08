import {
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useEffect,
    useState,
} from "react";
import useSessionManager from "../hooks/useSessionManager";
import useSessions from "../hooks/useSessions";
import useSettings from "../hooks/useSettings";
import useTimer from "../hooks/useTimer";
import { useAuthContext } from "./AuthContext";
import ContextGenerator from "./ContextGenerator";
import { useCurrentGameContext } from "./CurrentGameContext";
import { useFeedbackContext } from "./FeedbackContext";
import { TimerStatus } from "../lib/types/timer";
import useGames from "../hooks/useGames";

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
    resetToIdle: () => void;
    prepareForStart: () => void;
    prepareForEnd: () => void;
    startSession: () => void;
    stopSession: () => void;
    continueSession: () => void;
    endSession: () => void;
    createSessionWithFeedbackInDB: () => void;
    updateSessionWithFeedbackInDB: () => void;
}

const { Provider, useContextValue: useCurrentSession } =
    ContextGenerator<CurrentSessionContextType>("CurrentSession");

export function CurrentSessionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const { currentGame, setCurrentGame } = useCurrentGameContext();
    const { updateGame } = useGames();
    const { settingsState, refetch: refetchSettings } = useSettings();
    const { refetch: refetchSessions } = useSessions();
    const {
        beforeFeedback,
        setBeforeFeedback,
        afterFeedback,
        setAfterFeedback,
    } = useFeedbackContext();

    const [message, setMessage] = useState<string>(
        "Wanna Start a New Session?",
    );
    const [totalSeconds, setTotalSeconds] = useState<number>(50 * 60);
    const [settingsShouldChange, setSettingsShouldChange] =
        useState<boolean>(false);

    const {
        elapsed,
        status,
        timeString,
        progress,
        remainingTime,
        updateElapsedTime,
        resetToIdle,
        prepareForStart,
        prepareForEnd,
        beginTimer,
        pauseTimer,
        resumeTimer,
        endTimer,
    } = useTimer(totalSeconds);

    const sessionManager = useSessionManager({
        userId: user?.id || "",
        gameId: currentGame?.id || null,
        beforeFeedback,
        afterFeedback,
        onBeforeFeedbackCleared: () =>
            setBeforeFeedback({
                mood_before: 3,
                journal_before: "",
            }),
        onAfterFeedbackCleared: () =>
            setAfterFeedback({
                mood_after: 3,
                journal_after: "",
            }),
        onGameCleared: () => setCurrentGame(null),
        refetchSessions,
    });

    useEffect(() => {
        if (settingsShouldChange) {
            refetchSettings(true);
            setSettingsShouldChange(false);
        }
    }, [settingsShouldChange, refetchSettings]);

    useEffect(() => {
        if (settingsState.data?.session_limit_minutes) {
            setTotalSeconds(settingsState.data.session_limit_minutes * 60);
        }
    }, [settingsState.data?.session_limit_minutes]);

    function startSession() {
        updateElapsedTime(0);
        updateGameTimeSpent();
        setMessage(`Enjoy Playing ${currentGame?.title}!`);
        beginTimer();
        createSessionWithFeedbackInDB();
    }

    function stopSession() {
        pauseTimer();
    }

    function continueSession() {
        resumeTimer();
    }

    function endSession() {
        endTimer();
        setMessage("Time's up!");
        updateGameTimeSpent();
        updateSessionWithFeedbackInDB();
    }

    async function updateGameTimeSpent() {
        const sessionMinutes = Math.floor(elapsed / 60);

        // if user reached this state, they have already done the daily limit check
        // so we add sessionMinutes to both total_minutes and today_minutes
        if (currentGame) {
            const updatedTotal =
                currentGame.time_spent_total_minutes + sessionMinutes;
            //const updatedToday =
            //    currentGame.time_spent_today_minutes + sessionMinutes;
            const updatedGame = {
                ...currentGame,
                time_spent_total_minutes: updatedTotal,
                //time_spent_today_minutes: updatedToday,
            };

            setCurrentGame(updatedGame);

            updateGame(currentGame.id, {
                time_spent_total_minutes: updatedTotal,
                //time_spent_today_minutes: updatedToday,
            });
        }
    }

    async function createSessionWithFeedbackInDB() {
        await sessionManager.createSessionWithFeedback();
    }

    async function updateSessionWithFeedbackInDB() {
        await sessionManager.updateSessionWithFeedback();
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
                resetToIdle,
                prepareForStart,
                prepareForEnd,
                startSession,
                stopSession,
                continueSession,
                endSession,
                createSessionWithFeedbackInDB,
                updateSessionWithFeedbackInDB,
            }}
        >
            {children}
        </Provider>
    );
}

export { useCurrentSession };
