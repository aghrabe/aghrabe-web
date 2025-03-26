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

export type BeforeSessionFeedbackDto = Omit<
    ISessionFeedback,
    "id" | "created_at" | "updated_at" | "mood_after"
>;

export type AfterSessionFeedbackDto = Omit<
    ISessionFeedback,
    "id" | "created_at" | "updated_at" | "mood_before"
>;
