import useSettings from "../../hooks/useSettings";
import Button from "../Button";
import CircularProgress from "../CircularProgress";
import LoadingSpinner from "../LoadingSpinner";
import { useSession } from "../../context/SessionContext";

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

    if (settingsState.isLoading || !settingsState.data?.session_limit_minutes) {
        return <LoadingSpinner size={"large"} />;
    }

    return (
        <div className={"flex flex-col justify-center items-center gap-8"}>
            {errorMessage && (
                <p className={"text-2xl text-error"}>{errorMessage}</p>
            )}

            <p className={"text-2xl font-medium text-on-background"}>
                {message}
            </p>
            <CircularProgress
                progress={progress}
                text={timeString}
                size={"large"}
            />

            <div className={"flex flex-col gap-4 min-h-[110px]"}>
                {(status === "idle" || status === "ended") && (
                    <Button
                        onClick={startSession}
                        variant={"contained"}
                        size={"medium"}
                    >
                        Start
                    </Button>
                )}
                {status === "running" && (
                    <Button
                        onClick={stopSession}
                        variant={"contained"}
                        size={"medium"}
                    >
                        Stop
                    </Button>
                )}
                {status === "paused" && (
                    <>
                        <Button
                            onClick={continueSession}
                            variant={"contained"}
                            size={"medium"}
                        >
                            Continue
                        </Button>
                        <Button
                            onClick={endSession}
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
