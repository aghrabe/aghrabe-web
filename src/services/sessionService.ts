import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import { ISession, AddSessionDto } from "../lib/types/sessions";

export async function getSessionsService(
    userId: string,
): Promise<[Array<ISession> | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("sessions")
            .select("*, session_feedbacks(*), game:games (id, title)")
            .eq("user_id", userId)
            .order("start_time", { ascending: false });
        if (result.error) throw result.error;
        return result.data || [];
    });
}

export async function addSessionService(
    userId: string,
    newSession: AddSessionDto,
): Promise<[void | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("sessions")
            .insert({
                ...newSession,
                user_id: userId,
            })
            .single();
        if (result.error) throw result.error;
    });
}

export async function updateSessionService(
    sessionId: string,
    updatedFields: Partial<ISession>,
): Promise<[void | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("sessions")
            .update(updatedFields)
            .eq("id", sessionId);
        if (result.error) throw result.error;
        return;
    });
}
