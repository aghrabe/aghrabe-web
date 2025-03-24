import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreIcon from "../assets/icons/MoreIcon";
import Header from "../components/Header";
import Icon from "../components/Icon";
import LoadingSpinner from "../components/LoadingSpinner";
import SessionList from "../components/Session/SessionList";
import SessionTracker from "../components/Session/SessionTracker";
import SessionDetailsModal from "../components/SessionDetailModal";
import useSessions from "../hooks/useSessions";
import type { ISession } from "../lib/types/sessions";

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
                    "flex h-full flex-1 flex-col gap-4 border-t-2 border-outline p-4 md:pt-0 md:px-6 md:basis-2/5 md:border-l-2 md:border-t-0"
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
                <SessionDetailsModal
                    session={selectedSession}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}
