import { ISession } from "../lib/types/sessions";
import { Clock, Calendar, GamepadIcon as GameController } from "lucide-react";

interface RowProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
}

interface Props {
    session: ISession;
    formatDate: (date: string) => string;
}

function Row({ icon: Icon, label, value }: RowProps) {
    return (
        <div className={"flex items-center gap-2"}>
            <Icon size={18} className={"text-on-background-variant"} />
            <span className={"text-sm text-on-background-variant"}>
                {label}: <span className={"text-on-surface"}>{value}</span>
            </span>
        </div>
    );
}

export default function SessionCard({ session, formatDate }: Props) {
    return (
        <div
            className={
                "bg-surface text-on-surface rounded-lg shadow-md transition-all duration-200 ease-in-out hover:translate-y-[-4px] hover:shadow-lg cursor-pointer"
            }
        >
            <div className={"p-4"}>
                <h3 className={"font-bold text-lg"}>
                    Session {session.id.substring(0, 8)}...
                </h3>

                <div className={"h-px w-full bg-outline my-3"}></div>

                <div className={"flex flex-col space-y-3"}>
                    <Row
                        icon={GameController}
                        label="Game"
                        value={session.game_id}
                    />
                    <Row
                        icon={Calendar}
                        label="Started"
                        value={formatDate(session.start_time)}
                    />
                    {session.end_time && (
                        <Row
                            icon={Calendar}
                            label="Ended"
                            value={formatDate(session.end_time)}
                        />
                    )}
                    <Row
                        icon={Clock}
                        label="Duration"
                        value={`${session.duration_minutes} minutes`}
                    />
                </div>
            </div>
        </div>
    );
}
