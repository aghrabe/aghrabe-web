import { useBreakpoint } from "../../context/BreakpointContext";
import { useCurrentSession } from "../../context/CurrentSessionContext";
import useSettings from "../../hooks/useSettings";
import Button from "../Button";
import CircularProgress from "../CircularProgress";

export default function SessionTracker() {
    const { errorMessage } = useSettings();
    const {
        message,
        status,
        progress,
        timeString,
        handleStatusOnStart,
        handleStatusOnEnd,
        stopSession,
        continueSession,
    } = useCurrentSession();
    const { isMobile } = useBreakpoint();

    return (
        <div
            className={
                "flex flex-col justify-center items-center gap-6 md:gap-8"
            }
        >
            {errorMessage && (
                <p className={"text-xl md:text-2xl text-error"}>
                    {errorMessage}
                </p>
            )}

            <p className={"text-lg md:text-2xl font-medium text-on-background"}>
                {message}
            </p>
            <CircularProgress
                progress={progress}
                text={timeString}
                size={isMobile ? "medium" : "large"}
            />

            <div
                className={"flex flex-col gap-4 min-h-[60px] md:min-h-[110px]"}
            >
                {(status === "idle" || status === "ended") && (
                    <Button
                        onClick={handleStatusOnStart}
                        variant={"contained"}
                        size={isMobile ? "small" : "medium"}
                    >
                        Start
                    </Button>
                )}
                {status === "running" && (
                    <Button
                        onClick={stopSession}
                        variant={"contained"}
                        size={isMobile ? "small" : "medium"}
                    >
                        Stop
                    </Button>
                )}
                {status === "paused" && (
                    <>
                        <Button
                            onClick={continueSession}
                            variant={"contained"}
                            size={isMobile ? "small" : "medium"}
                        >
                            Continue
                        </Button>
                        <Button
                            onClick={handleStatusOnEnd}
                            variant={"outlined"}
                            size={isMobile ? "small" : "medium"}
                            className={`${isMobile ? "mb-4" : ""}`}
                        >
                            End
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
