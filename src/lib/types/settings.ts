export interface ISettings {
    id: string;
    user_id: string;
    daily_limit_minutes: number;
    session_limit_minutes: number;
    break_duration_minutes: number;
    notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}
