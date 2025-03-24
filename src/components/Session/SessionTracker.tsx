import { useBreakpoint } from "../../context/BreakpointContext";
import { useSession } from "../../context/SessionContext";
import useSettings from "../../hooks/useSettings";
import { TAILWIND_BREAKPOINTS } from "../../lib/constants/tailwind";
import Button from "../Button";
import CircularProgress from "../CircularProgress";
import LoadingSpinner from "../LoadingSpinner";

export default function SessionTracker() {
    const { settingsState, errorMessage } = useSettings();
    const {
        message,
        status,
        progress,
        timeString,
        startSession,
        stopSession,
        continueSession,
        endSession,
    } = useSession();
    const { width } = useBreakpoint();

    if (settingsState.isLoading || !settingsState.data?.session_limit_minutes) {
        return <LoadingSpinner size={"large"} />;
    }

    return (
        <div className={"flex flex-col justify-center items-center gap-8"}>
            {errorMessage && (
                <p className={"text-xl md:text-2xl text-error"}>
                    {errorMessage}
                </p>
            )}

            <p className={"text-xl md:text-2xl font-medium text-on-background"}>
                {message}
            </p>
            <CircularProgress
                progress={progress}
                text={timeString}
                size={width < TAILWIND_BREAKPOINTS.md ? "medium" : "large"}
            />

            <div
                className={"flex flex-col gap-4 min-h-[60px] md:min-h-[110px]"}
            >
                {(status === "idle" || status === "ended") && (
                    <Button
                        onClick={startSession}
                        variant={"contained"}
                        size={
                            width < TAILWIND_BREAKPOINTS.md ? "small" : "medium"
                        }
                    >
                        Start
                    </Button>
                )}
                {status === "running" && (
                    <Button
                        onClick={stopSession}
                        variant={"contained"}
                        size={
                            width < TAILWIND_BREAKPOINTS.md ? "small" : "medium"
                        }
                    >
                        Stop
                    </Button>
                )}
                {status === "paused" && (
                    <>
                        <Button
                            onClick={continueSession}
                            variant={"contained"}
                            size={
                                width < TAILWIND_BREAKPOINTS.md
                                    ? "small"
                                    : "medium"
                            }
                        >
                            Continue
                        </Button>
                        <Button
                            onClick={endSession}
                            variant={"outlined"}
                            size={
                                width < TAILWIND_BREAKPOINTS.md
                                    ? "small"
                                    : "medium"
                            }
                            className={`${width < TAILWIND_BREAKPOINTS.md ? "mb-4" : ""}`}
                        >
                            End
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
