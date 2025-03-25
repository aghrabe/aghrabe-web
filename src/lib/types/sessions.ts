import { IGame } from "./games";
import { ISessionFeedback } from "./sessionFeedbacks";

export interface SessionBase {
    user_id: string;
    start_time: string;
    duration_minutes: number;
}

export interface ISession extends SessionBase {
    id: string;
    game: IGame;
    session_feedbacks: Array<ISessionFeedback>;
    end_time?: string | null;
    created_at: string;
}

export interface AddSessionDto extends SessionBase {
    game_id: string;
    end_time: string | null;
}
