export interface ISession {
    id: string;
    user_id: string;
    game_id: string;
    start_time: string;
    end_time?: string | null;
    duration_minutes: number;
    created_at: string;
    updated_at: string;
}
