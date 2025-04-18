import {
    CalendarDays,
    Clock,
    Gamepad2Icon as GameController2,
    X,
} from "lucide-react";
import type React from "react";
import useMoodMapper from "../../hooks/useMoodMapper";
import type { ISession } from "../../lib/types/sessions";
import Modal from "./Modal";

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
                <p className={"text-on-surface font-bold"}>{label}</p>
                <p className={""}>{value}</p>
            </div>
        </div>
    );
}

function SessionNote({ title, content }: { title: string; content: string }) {
    return (
        <div className={"space-y-2 text-sm md:text-lg"}>
            <h3 className={"font-bold"}>{title}</h3>
            <p
                className={
                    "rounded-md p-3 text-sm max-w-[100vw] overflow-auto whitespace-pre-line"
                }
            >
                {content}
            </p>
        </div>
    );
}

export default function SessionDetailsModal({
    session,
    onClose,
}: SessionDetailsModalProps) {
    const { getMoodIcon, getMoodText } = useMoodMapper();

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div
                className={
                    "sticky top-0 z-10 bg-surface flex items-start justify-between md:px-6 pb-4 md:pb-0"
                }
            >
                <div className={"flex flex-col items-start gap-2"}>
                    <h2 className={"text-lg md:text-xl font-bold"}>
                        Session Details
                    </h2>
                    <div
                        className={
                            "rounded-full text-base md:text-lg font-medium"
                        }
                    >
                        ID: {session.id.substring(0, 8)}...
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={
                        "p-2 rounded-full hover:bg-outline transition-colors cursor-pointer"
                    }
                    aria-label={"Close modal"}
                >
                    <X className={"h-5 w-5"} />
                </button>
            </div>
            <div
                className={
                    "max-h-[80vh] space-y-4 md:space-y-6 overflow-y-auto p-0 md:p-6 relative"
                }
            >
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

                {/*
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
                */}
            </div>
        </Modal>
    );
}
