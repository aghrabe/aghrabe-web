import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreIcon from "../assets/icons/MoreIcon";
import Button from "../components/Button";
import Header from "../components/Header";
import Icon from "../components/Icon";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import SessionList from "../components/Session/SessionList";
import SessionTracker from "../components/Session/SessionTracker";
import useSessions from "../hooks/useSessions";
import type { ISession } from "../lib/types/sessions";
import {
    CalendarDays,
    Clock,
    Frown,
    Gamepad2Icon as GameController2,
    Meh,
    Smile,
    SmilePlus,
} from "lucide-react";

export default function Session() {
    const { sessionsState } = useSessions();
    const [selectedSession, setSelectedSession] = useState<ISession | null>(
        null,
    );
    const navigate = useNavigate();

    function handleModalClose() {
        setSelectedSession(null);
        navigate("");
    }

    const getMoodIcon = (mood: number) => {
        switch (mood) {
            case 1:
                return <Frown className={"h-5 w-5 text-mood-red"} />;
            case 2:
                return <Meh className={"h-5 w-5 text-mood-orange"} />;
            case 3:
                return <Smile className={"h-5 w-5 text-mood-yellow"} />;
            case 4:
                return <Smile className={"h-5 w-5 text-mood-blue"} />;
            case 5:
                return <SmilePlus className={"h-5 w-5 text-mood-green"} />;
            default:
                return <Smile className={"h-5 w-5 text-outline-variant"} />;
        }
    };

    if (!sessionsState.data) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner />
                    <p className="text-muted-foreground">
                        Loading your sessions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={"flex h-full w-full flex-col md:flex-row md:gap-8"}>
            <div
                className={
                    "basis-3/5 h-full flex flex-col gap-8 md:gap-0 justify-between"
                }
            >
                <Header header={"Session"}>
                    <Icon size={"medium"}>
                        <MoreIcon />
                    </Icon>
                </Header>
                <SessionTracker />
                <div></div>
            </div>

            <div
                className={
                    "flex h-full flex-1 flex-col gap-4 border-t-2 border-outline bg-muted/10 p-4 md:px-6 md:basis-2/5 md:border-l-2 md:border-t-0"
                }
            >
                <Header header={"History"} />

                <div className={"flex-1 overflow-y-auto rounded-lg"}>
                    {sessionsState.data.length > 0 ? (
                        <SessionList
                            sessions={sessionsState.data}
                            onSessionClick={setSelectedSession}
                        />
                    ) : (
                        <div
                            className={
                                "flex h-full flex-col items-center justify-center text-center text-muted-foreground"
                            }
                        >
                            <CalendarDays
                                className={"mb-2 h-12 w-12 opacity-50"}
                            />
                            <h3 className={"text-lg font-medium"}>
                                No sessions yet
                            </h3>
                            <p className={"mt-1 max-w-md text-sm"}>
                                Start a new gaming session to track your time
                                and mood
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedSession && (
                <Modal isOpen={true} onClose={handleModalClose}>
                    <div className={"max-h-[80vh] overflow-y-auto p-6"}>
                        <div
                            className={"mb-6 flex items-center justify-between"}
                        >
                            <h2 className={"text-2xl font-bold"}>
                                Session Details
                            </h2>
                            <div
                                className={
                                    "rounded-full bg-muted px-3 py-1 text-lg font-medium"
                                }
                            >
                                ID: {selectedSession.id.substring(0, 8)}...
                            </div>
                        </div>

                        <div className={"grid gap-6 md:grid-cols-2"}>
                            <div
                                className={
                                    "space-y-4 rounded-lg border border-outline bg-card p-4"
                                }
                            >
                                <div className={"flex items-center gap-3"}>
                                    <GameController2
                                        className={"h-5 w-5 text-primary"}
                                    />
                                    <div>
                                        <p
                                            className={
                                                "text-xs text-muted-foreground"
                                            }
                                        >
                                            Game
                                        </p>
                                        <p className={"font-medium"}>
                                            {selectedSession.game.title}
                                        </p>
                                    </div>
                                </div>

                                <div className={"flex items-center gap-3"}>
                                    <CalendarDays
                                        className={"h-5 w-5 text-primary"}
                                    />
                                    <div>
                                        <p
                                            className={
                                                "text-xs text-muted-foreground"
                                            }
                                        >
                                            Started
                                        </p>
                                        <p className={"font-medium"}>
                                            {new Date(
                                                selectedSession.start_time,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {selectedSession.end_time && (
                                    <div className={"flex items-center gap-3"}>
                                        <CalendarDays
                                            className={"h-5 w-5 text-primary"}
                                        />
                                        <div>
                                            <p
                                                className={
                                                    "text-xs text-muted-foreground"
                                                }
                                            >
                                                Ended
                                            </p>
                                            <p className={"font-medium"}>
                                                {new Date(
                                                    selectedSession.end_time,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className={"flex items-center gap-3"}>
                                    <Clock className={"h-5 w-5 text-primary"} />
                                    <div>
                                        <p
                                            className={
                                                "text-xs text-muted-foreground"
                                            }
                                        >
                                            Duration
                                        </p>
                                        <p className={"font-medium"}>
                                            {selectedSession.duration_minutes}{" "}
                                            minutes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={
                                    "space-y-4 rounded-lg border border-outline bg-card p-4"
                                }
                            >
                                <div className={"flex items-center gap-3"}>
                                    {getMoodIcon(
                                        selectedSession.session_feedbacks[0]
                                            .mood_before,
                                    )}
                                    <div>
                                        <p
                                            className={
                                                "text-xs text-muted-foreground"
                                            }
                                        >
                                            Mood Before
                                        </p>
                                        <p className={"font-medium"}>
                                            {
                                                selectedSession
                                                    .session_feedbacks[0]
                                                    .mood_before
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className={"flex items-center gap-3"}>
                                    {getMoodIcon(
                                        selectedSession.session_feedbacks[0]
                                            .mood_after,
                                    )}
                                    <div>
                                        <p
                                            className={
                                                "text-xs text-muted-foreground"
                                            }
                                        >
                                            Mood After
                                        </p>
                                        <p className={"font-medium"}>
                                            {
                                                selectedSession
                                                    .session_feedbacks[0]
                                                    .mood_after
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 rounded-lg border border-outline bg-card p-4">
                            <div>
                                <h3 className="mb-2 font-medium">
                                    Notes Before Session
                                </h3>
                                <p className="rounded-md bg-muted p-3 text-sm">
                                    {selectedSession.session_feedbacks[0]
                                        .journal_before || "No notes recorded"}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 font-medium">
                                    Notes After Session
                                </h3>
                                <p className="rounded-md bg-muted p-3 text-sm">
                                    {selectedSession.session_feedbacks[0]
                                        .journal_after || "No notes recorded"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                onClick={handleModalClose}
                                variant="contained"
                                fullWidth
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
