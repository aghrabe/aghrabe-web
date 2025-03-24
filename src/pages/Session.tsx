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
import { ISession } from "../lib/types/sessions";

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
        return <LoadingSpinner />;
    }

    return (
        <div className={"flex w-full h-full gap-8"}>
            <div className={"basis-3/5 h-full flex flex-col justify-between"}>
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
                    "basis-2/5 h-full flex flex-col border-l-2 border-outline px-8 gap-4"
                }
            >
                <Header header={"History"} />
                <div className={"overflow-y-auto h-[calc(100%-45px)]"}>
                    <SessionList
                        sessions={sessionsState.data}
                        onSessionClick={setSelectedSession}
                    />
                </div>
            </div>

            {selectedSession && (
                <Modal isOpen={true} onClose={handleModalClose}>
                    <div className={"p-4"}>
                        <h2 className={"text-xl font-bold mb-4"}>
                            Session {selectedSession.id.substring(0, 8)}...
                        </h2>
                        <p>
                            <span className={"font-medium"}>Game:</span>{" "}
                            {selectedSession.game.title}
                        </p>
                        <p>
                            <span className={"font-medium"}>Started:</span>{" "}
                            {new Date(
                                selectedSession.start_time,
                            ).toLocaleString()}
                        </p>
                        {selectedSession.end_time && (
                            <p>
                                <span className={"font-medium"}>Ended:</span>{" "}
                                {new Date(
                                    selectedSession.end_time,
                                ).toLocaleString()}
                            </p>
                        )}
                        <p>
                            <span className={"font-medium"}>Duration:</span>{" "}
                            {selectedSession.duration_minutes} minutes
                        </p>

                        <p>
                            <span className={"font-medium"}>Mood Before:</span>{" "}
                            {selectedSession.session_feedbacks[0].mood_before}
                        </p>

                        <p>
                            <span className={"font-medium"}>Mood After:</span>{" "}
                            {selectedSession.session_feedbacks[0].mood_after}
                        </p>
                        <div className={"mt-4"}>
                            <Button
                                onClick={handleModalClose}
                                variant={"contained"}
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
