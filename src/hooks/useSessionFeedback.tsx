import { useCallback, useState } from "react";
import {
    ISessionFeedback,
    NewSessionFeedbackDto,
} from "../lib/types/sessionFeedbacks";
import {
    getSessionFeedbacksService,
    addSessionFeedbackService,
} from "../services/sessionFeedbackService";
import useQuery from "./useQuery";
import { useAuthContext } from "../context/AuthContext";

export default function useSessionFeedback(sessionId?: string) {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSessionFeedbacks = useCallback(async (): Promise<
        Array<ISessionFeedback>
    > => {
        if (!user?.id) return [];
        const [feedbacks, error] = await getSessionFeedbacksService(
            user.id,
            sessionId,
        );
        if (error) {
            setErrorMessage(error.message);
            return [];
        }
        return feedbacks!;
    }, [user?.id, sessionId]);

    const { state: feedbackState, refetch } = useQuery<Array<ISessionFeedback>>(
        `sessionFeedbacks.${user?.id}.${sessionId || "all"}`,
        getSessionFeedbacks,
        30 * 60 * 1000, // 30 minutes
    );

    const addSessionFeedback = useCallback(
        async (newFeedback: NewSessionFeedbackDto): Promise<void> => {
            const [, error] = await addSessionFeedbackService(newFeedback);
            if (error) {
                setErrorMessage(error.message);
            } else {
                refetch(true);
            }
        },
        [refetch],
    );

    return {
        feedbackState,
        errorMessage,
        addSessionFeedback,
        refetch,
    };
}
