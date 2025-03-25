export interface IGame {
    id: string;
    user_id: string;
    title: string;
    cover?: string;
    time_spent_total_minutes: number;
    time_spent_today_minutes: number;
    created_at: string;
    updated_at: string;
}
