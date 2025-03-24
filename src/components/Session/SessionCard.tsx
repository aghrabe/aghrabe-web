import { Calendar, Clock, Gamepad2 as GameController } from "lucide-react";
import { Link } from "react-router-dom";
import { useBreakpoint } from "../../context/BreakpointContext";
import { ISession } from "../../lib/types/sessions";

interface RowProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
}

interface Props {
    session: ISession;
    formatDate: (date: string) => string;
    onClick?: () => void;
}

function Row({ icon: Icon, label, value }: RowProps) {
    const { isMobile } = useBreakpoint();

    return (
        <div className={"flex items-center gap-2"}>
            <Icon
                size={isMobile ? 18 : 19}
                className={"text-on-background-variant"}
            />
            <span
                className={
                    "text-sm font-bold md:text-base text-on-background-variant"
                }
            >
                {label}:{" "}
                <span className={"text-on-surface font-normal"}>{value}</span>
            </span>
        </div>
    );
}

export default function SessionCard({ session, formatDate, onClick }: Props) {
    return (
        <Link
            to={`?card=${session.id}`}
            onClick={onClick}
            className={
                "bg-surface text-on-surface rounded-lg shadow-md transition-all duration-200 ease-in-out hover:translate-y-[-4px] hover:shadow-lg cursor-pointer"
            }
        >
            <div className={"p-4"}>
                <h3 className={"font-bold text-base md:text-lg"}>
                    Session {session.id.substring(0, 8)}...
                </h3>

                <div className={"h-px w-full bg-outline my-3"}></div>

                <div className={"flex flex-col space-y-3"}>
                    <Row
                        icon={GameController}
                        label={"Game"}
                        value={session.game.title}
                    />
                    <Row
                        icon={Calendar}
                        label={"Started"}
                        value={formatDate(session.start_time)}
                    />
                    {session.end_time && (
                        <Row
                            icon={Calendar}
                            label={"Ended"}
                            value={formatDate(session.end_time)}
                        />
                    )}
                    <Row
                        icon={Clock}
                        label={"Duration"}
                        value={`${session.duration_minutes} minutes`}
                    />
                </div>
            </div>
        </Link>
    );
}
