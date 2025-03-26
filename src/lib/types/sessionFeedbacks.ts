export interface ISessionFeedback {
    id: string;
    user_id: string;
    game_id: string;
    session_id: string;
    mood_before: number;
    mood_after: number;
    journal_before?: string;
    journal_after?: string;
    created_at: string;
    updated_at: string;
}

export type NewSessionFeedbackDto = Omit<
    ISessionFeedback,
    "id" | "created_at" | "updated_at"
>;
