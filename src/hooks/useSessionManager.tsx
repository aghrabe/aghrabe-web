import { useState } from "react";
import type {
    AfterSessionFeedbackDto,
    BeforeSessionFeedbackDto,
} from "../lib/types/sessionFeedbacks";
import type { CreateSessionDto, UpdateSessionDto } from "../lib/types/sessions";
import useSessionFeedback from "./useSessionFeedback";
import useSessions from "./useSessions";
import {
    AfterFeedbackPayload,
    BeforeFeedbackPayload,
} from "../context/FeedbackContext";

interface SessionManagerProps {
    userId: string;
    gameId: string | null;
    beforeFeedback: BeforeFeedbackPayload | null;
    afterFeedback: AfterFeedbackPayload | null;
    onBeforeFeedbackCleared: () => void;
    onAfterFeedbackCleared: () => void;
    onGameCleared: () => void;
    refetchSessions: (force?: boolean) => Promise<void>;
}

export default function useSessionManager({
    userId,
    gameId,
    beforeFeedback,
    afterFeedback,
    onBeforeFeedbackCleared,
    onAfterFeedbackCleared,
    onGameCleared,
    refetchSessions,
}: SessionManagerProps) {
    const { addSession, updateSession } = useSessions();
    const { addSessionFeedback, updateSessionFeedback } = useSessionFeedback();
    const [createdSessionID, setCreatedSessionID] = useState<string | null>(
        null,
    );
    const [createdFeedbackID, setCreatedFeedbackID] = useState<string | null>(
        null,
    );
    const [startTimeState, setStartTimeState] = useState<string>("");

    async function createSessionWithFeedback() {
        if (!userId) {
            console.error("Unauthorized");
            return false;
        }
        if (!gameId) {
            console.error("Select a game");
            return false;
        }

        const startTime = new Date().toISOString();
        setStartTimeState(startTime);

        const sessionData: CreateSessionDto = {
            user_id: userId,
            game_id: gameId,
            start_time: startTime,
            end_time: null,
        };

        const sessionID = await addSession(sessionData);
        if (!sessionID) {
            console.error("Creating session failed, no sessionID");
            return false;
        }
        setCreatedSessionID(sessionID);

        if (!beforeFeedback) {
            console.error("Before feedback is empty");
            return false;
        }

        const feedbackData: BeforeSessionFeedbackDto = {
            user_id: userId,
            game_id: gameId,
            session_id: sessionID,
            mood_before: beforeFeedback.mood_before,
            journal_before: beforeFeedback.journal_before,
        };

        const feedbackID = await addSessionFeedback(feedbackData);
        if (!feedbackID) {
            console.error("Creating feedback failed, no feedbackID");
            return false;
        }

        setCreatedFeedbackID(feedbackID);
        onBeforeFeedbackCleared();
        return true;
    }

    async function updateSessionWithFeedback() {
        if (!userId) {
            console.error("Unauthorized");
            return false;
        }
        if (!gameId) {
            console.error("Select a game");
            return false;
        }
        if (!createdSessionID) {
            console.error("No session ID to update");
            return false;
        }
        if (!afterFeedback) {
            console.error("After feedback is empty");
            return false;
        }
        if (!createdFeedbackID) {
            console.error("No feedback ID to update");
            return false;
        }

        const sessionData: UpdateSessionDto = {
            user_id: userId,
            game_id: gameId,
            start_time: startTimeState,
            end_time: new Date().toISOString(),
        };

        await updateSession(createdSessionID, sessionData);

        const feedbackData: AfterSessionFeedbackDto = {
            user_id: userId,
            game_id: gameId,
            session_id: createdSessionID,
            mood_after: afterFeedback.mood_after,
            journal_after: afterFeedback.journal_after,
        };

        await updateSessionFeedback(createdFeedbackID, feedbackData);
        await refetchSessions(true);

        setStartTimeState("");
        onGameCleared();
        onAfterFeedbackCleared();
        return true;
    }

    return {
        createdSessionID,
        createdFeedbackID,
        startTimeState,
        createSessionWithFeedback,
        updateSessionWithFeedback,
    };
}
