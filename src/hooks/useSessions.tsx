import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { CreateSessionDto, ISession } from "../lib/types/sessions";
import {
    addSessionService,
    getSessionsFromLastWeekService,
    getSessionsFromTodayService,
    getSessionsService,
    getSingleSessionService,
    updateSessionService,
} from "../services/sessionService";
import useQuery from "./useQuery";

function sumSessionDurations(sessions: Array<ISession>): number {
    return sessions.reduce((total, session) => {
        return total + Number(session.duration_minutes || 0);
    }, 0);
}

function handleError<T>(
    error: Error | null,
    fallback: T,
    set: (msg: string) => void,
): T {
    if (error) {
        set(error.message);
        return fallback;
    }
    return fallback;
}

export default function useSessions(
    currentPage: number = 1,
    pageSize: number = 10,
) {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSessions = useCallback(async (): Promise<Array<ISession>> => {
        if (!user?.id) return [];
        const [sessions, error] = await getSessionsService(
            user.id,
            currentPage,
            pageSize,
        );
        if (error) {
            setErrorMessage(error.message);
            return [];
        }
        return sessions!;
    }, [user?.id, currentPage, pageSize]);

    const { state: sessionsState, refetch } = useQuery<Array<ISession>>(
        `sessions.${user?.id}.page.${currentPage}.size.${pageSize}`,
        getSessions,
        30 * 60 * 1000, // 30 min
    );

    const getTotalTime = useCallback(
        async (
            getterFunction: (
                userId: string,
            ) => Promise<[Array<ISession> | null, Error | null]>,
        ): Promise<number> => {
            if (!user?.id) return 0;
            const [sessions, error] = await getterFunction(user.id);
            return (
                handleError(error, 0, setErrorMessage) ||
                sumSessionDurations(sessions || [])
            );
        },
        [user?.id],
    );

    const getSessionsFromLastWeek = useCallback(async (): Promise<
        Array<ISession>
    > => {
        if (!user?.id) return [];
        const [sessions, error] = await getSessionsFromLastWeekService(user.id);
        return (handleError(error, [], setErrorMessage) || sessions) ?? [];
    }, [user?.id]);

    const getTotalTimeToday = useCallback(
        () => getTotalTime(getSessionsFromTodayService),
        [getTotalTime],
    );

    const getTotalTimeAllTime = useCallback(
        () => getTotalTime(getSessionsService),
        [getTotalTime],
    );

    const getTotalTimeLastWeek = useCallback(
        () => getTotalTime(getSessionsFromLastWeekService),
        [getTotalTime],
    );

    const getSingleSession = useCallback(
        async (sessionId: string): Promise<ISession | null> => {
            const [session, error] = await getSingleSessionService(sessionId);
            return handleError(error, null, setErrorMessage) || session;
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
        getTotalTimeAllTime,
        getSessionsFromLastWeek,
        getTotalTimeToday,
        getTotalTimeLastWeek,
        getSingleSession,
        refetch,
    };
}
