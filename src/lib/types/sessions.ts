import { IGame } from "./games";
import { ISessionFeedback } from "./sessionFeedbacks";

export interface SessionBase {
    user_id: string;
    start_time: string;
}

export interface ISession extends SessionBase {
    id: string;
    game: IGame;
    session_feedbacks: Array<ISessionFeedback>;
    end_time?: string | null;
    created_at: string;
    duration_minutes: number;
}

export interface CreateSessionDto extends SessionBase {
    game_id: string;
    end_time: string | null;
}

export interface UpdateSessionDto extends CreateSessionDto {
    end_time: string;
}
