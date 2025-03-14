export type LogType = "limit_reached" | "break_ignored" | "warning" | "pause";

export interface ILog {
    id: string;
    user_id: string;
    game_id?: string;
    type: LogType;
    timestamp: string;
    message: string;
    created_at: string;
}
