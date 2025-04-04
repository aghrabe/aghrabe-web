import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { CreateSessionDto, ISession } from "../lib/types/sessions";
import {
    addSessionService,
    getSessionsService,
    getSingleSessionService,
    updateSessionService,
} from "../services/sessionService";
import useQuery from "./useQuery";

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

    const getSingleSession = useCallback(
        async (sessionId: string): Promise<ISession | null> => {
            const [session, error] = await getSingleSessionService(sessionId);
            if (error) {
                setErrorMessage(error.message);
                return null;
            }
            return session;
        },
        [],
    );

    const addSession = useCallback(
        async (newSession: CreateSessionDto): Promise<string | undefined> => {
            if (!user?.id) return;
            const [result, error] = await addSessionService(
                user.id,
                newSession,
            );
            if (error) {
                setErrorMessage(error.message);
            } else {
                refetch(true);
                return result?.id;
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
                console.error(error.message);
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
        getSingleSession,
        refetch,
    };
}
