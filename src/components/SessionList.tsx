import { ISession } from "../../lib/types/sessions";
import SessionCard from "./Session/SessionCardd";

interface SessionListProps {
    sessions: ISession[];
}

export default function SessionList({ sessions = [] }: SessionListProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={"h-full overflow-y-auto pr-1 custom-scrollbar"}>
            <div className={"flex flex-col space-y-4 p-2"}>
                {sessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        formatDate={formatDate}
                    />
                ))}
            </div>
        </div>
    );
}
