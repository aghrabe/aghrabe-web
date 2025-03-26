import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { ISession, AddSessionDto } from "../lib/types/sessions";
import useQuery from "./useQuery";
import {
    getSessionsService,
    addSessionService,
    updateSessionService,
} from "../services/sessionService";

export default function useSessions() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSessions = useCallback(async (): Promise<Array<ISession>> => {
        if (!user?.id) return [];
        const [sessions, error] = await getSessionsService(user.id);
        if (error) {
            setErrorMessage(error.message);
            return [];
        }
        return sessions!;
    }, [user?.id]);

    const { state: sessionsState, refetch } = useQuery<Array<ISession>>(
        `sessions.${user?.id}`,
        getSessions,
        30 * 60 * 1000, // 30 min
    );

    const addSession = useCallback(
        async (newSession: AddSessionDto): Promise<void> => {
            if (!user?.id) return;
            const [, error] = await addSessionService(user.id, newSession);
            if (error) {
                setErrorMessage(error.message);
            } else {
                refetch(true);
            }
        },
        [refetch, user?.id],
    );

    const updateSession = useCallback(
        async (
            sessionId: string,
            updatedFields: Partial<ISession>,
        ): Promise<void> => {
            const [, error] = await updateSessionService(
                sessionId,
                updatedFields,
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
        sessionsState,
        errorMessage,
        addSession,
        updateSession,
    };
}
