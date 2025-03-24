import { IGame } from "./games";
import { ISessionFeedback } from "./sessionFeedbacks";

export interface ISession {
    id: string;
    user_id: string;
    //game_id: string;
    game: IGame;
    session_feedbacks: ISessionFeedback[];
    start_time: string;
    end_time?: string | null;
    duration_minutes: number;
    created_at: string;
    updated_at: string;
}
