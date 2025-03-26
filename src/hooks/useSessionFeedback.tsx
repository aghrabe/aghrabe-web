import { useCallback, useState } from "react";
import {
    ISessionFeedback,
    BeforeSessionFeedbackDto,
} from "../lib/types/sessionFeedbacks";
import {
    getSessionFeedbacksService,
    addSessionFeedbackService,
    updateSessionFeedbackService,
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
        async (
            newFeedback: BeforeSessionFeedbackDto,
        ): Promise<string | undefined> => {
            const [feedback, error] =
                await addSessionFeedbackService(newFeedback);
            if (error) {
                setErrorMessage(error.message);
                return;
            } else {
                refetch(true);
                return feedback?.id || undefined;
            }
        },
        [refetch],
    );

    const updateSessionFeedback = useCallback(
        async (
            feedbackId: string,
            updatedFeedback: Partial<BeforeSessionFeedbackDto>,
        ): Promise<void> => {
            const [, error] = await updateSessionFeedbackService(
                feedbackId,
                updatedFeedback,
            );
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
        updateSessionFeedback,
        refetch,
    };
}
