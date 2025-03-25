import {
    CalendarDays,
    Clock,
    Gamepad2Icon as GameController2,
} from "lucide-react";
import Button from "../Button";
import Modal from "./Modal";
import { useBreakpoint } from "../../context/BreakpointContext";
import useMoodMapper from "../../hooks/useMoodMapper";
import type { ISession } from "../../lib/types/sessions";

interface SessionDetailsModalProps {
    session: ISession;
    onClose: () => void;
}

function SessionDetailItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
}) {
    return (
        <div className={"flex items-center gap-3"}>
            {icon}
            <div
                className={"text-sm md:text-base flex flex-col gap-0 md:gap-0"}
            >
                <p className={"text-muted-foreground font-bold"}>{label}</p>
                <p className={""}>{value}</p>
            </div>
        </div>
    );
}

function SessionNote({ title, content }: { title: string; content: string }) {
    return (
        <div className={"space-y-2 text-sm md:text-lg"}>
            <h3 className={"font-bold"}>{title}</h3>
            <p className={"rounded-md p-3 text-sm"}>{content}</p>
        </div>
    );
}

export default function SessionDetailsModal({
    session,
    onClose,
}: SessionDetailsModalProps) {
    const { isMobile } = useBreakpoint();
    const { getMoodIcon, getMoodText } = useMoodMapper();

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div
                className={
                    "max-h-[80vh] space-y-4 md:space-y-6 overflow-y-auto p-0 md:p-6"
                }
            >
                <div className={"flex items-center justify-between"}>
                    <h2 className={"text-xl md:text-2xl font-bold"}>
                        Session Details
                    </h2>
                    <div
                        className={
                            "rounded-full px-3 py-1 text-base md:text-lg font-medium"
                        }
                    >
                        ID: {session.id.substring(0, 8)}...
                    </div>
                </div>

                <div className={"grid gap-4 md:gap-6 md:grid-cols-2"}>
                    <div
                        className={
                            "space-y-3 md:space-y-4 rounded-lg border border-outline bg-card p-4"
                        }
                    >
                        <SessionDetailItem
                            icon={
                                <GameController2
                                    className={
                                        "h-5 w-5 md:h-6 md:w-6 text-primary"
                                    }
                                />
                            }
                            label={"Game"}
                            value={session.game.title}
                        />

                        <SessionDetailItem
                            icon={
                                <CalendarDays
                                    className={
                                        "h-5 w-5 md:h-6 md:w-6 text-primary"
                                    }
                                />
                            }
                            label={"Started"}
                            value={new Date(
                                session.start_time,
                            ).toLocaleString()}
                        />

                        {session.end_time && (
                            <SessionDetailItem
                                icon={
                                    <CalendarDays
                                        className={
                                            "h-5 w-5 md:h-6 md:w-6 text-primary"
                                        }
                                    />
                                }
                                label={"Ended"}
                                value={new Date(
                                    session.end_time,
                                ).toLocaleString()}
                            />
                        )}

                        <SessionDetailItem
                            icon={
                                <Clock
                                    className={
                                        "h-5 w-5 md:h-6 md:w-6 text-primary"
                                    }
                                />
                            }
                            label={"Duration"}
                            value={`${session.duration_minutes} minutes`}
                        />
                    </div>

                    <div
                        className={
                            "space-y-3 md:space-y-4 rounded-lg border border-outline bg-card p-4"
                        }
                    >
                        <SessionDetailItem
                            icon={getMoodIcon(
                                session.session_feedbacks[0].mood_before,
                            )}
                            label={"Mood Before"}
                            value={getMoodText(
                                session.session_feedbacks[0].mood_before,
                            )}
                        />

                        <SessionDetailItem
                            icon={getMoodIcon(
                                session.session_feedbacks[0].mood_after,
                            )}
                            label={"Mood After"}
                            value={getMoodText(
                                session.session_feedbacks[0].mood_after,
                            )}
                        />
                    </div>
                </div>

                <div
                    className={
                        "space-y-2 md:space-y-4 rounded-lg border border-outline bg-card p-4"
                    }
                >
                    <SessionNote
                        title={"Notes Before Session"}
                        content={
                            session.session_feedbacks[0].journal_before ||
                            "No notes recorded"
                        }
                    />

                    <SessionNote
                        title={"Notes After Session"}
                        content={
                            session.session_feedbacks[0].journal_after ||
                            "No notes recorded"
                        }
                    />
                </div>

                <div className={"mt-6"}>
                    <Button
                        onClick={onClose}
                        variant={"contained"}
                        size={isMobile ? "small" : "medium"}
                        fullWidth
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
