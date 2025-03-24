import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import safeExecute from "../lib/safeExecute";
import { ISession } from "../lib/types/sessions";
import supabase from "../services/supabaseClient";
import useQuery from "./useQuery";

export default function useSessions() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSessions = useCallback(async (): Promise<ISession[]> => {
        const [data, error] = await safeExecute<ISession[], Error>(async () => {
            const result = await supabase
                .from("sessions")
                .select("*, session_feedbacks(*), game:games (id, title)")
                .eq("user_id", user?.id)
                .order("start_time", { ascending: false });

            if (result.error) throw result.error;

            return result.data || [];
        });

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

    const { state: sessionsState, refetch } = useQuery<ISession[]>(
        `sessions.${user?.id}`,
        getSessions,
        30 * 60 * 1000, // 30 min
    );

    const addSession = useCallback(
        async (newSession: Partial<ISession>): Promise<void> => {
            if (!user?.id) return;

            const [, error] = await safeExecute<void, Error>(async () => {
                const result = await supabase
                    .from("sessions")
                    .insert({
                        ...newSession,
                        user_id: user.id,
                    })
                    .single();

                if (result.error) throw result.error;
            });

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
            const [, error] = await safeExecute<void, Error>(async () => {
                const result = await supabase
                    .from("sessions")
                    .update(updatedFields)
                    .eq("id", sessionId);

                if (result.error) throw result.error;
            });

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
