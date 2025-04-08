import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import { ISession, CreateSessionDto } from "../lib/types/sessions";

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

export async function getSessionsFromLastWeekService(
    userId: string,
): Promise<[Array<ISession> | null, Error | null]> {
    return await safeExecute(async () => {
        const lastWeek = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
        const result = await supabase
            .from("sessions")
            .select("*, session_feedbacks(*), game:games (id, title)")
            .eq("user_id", userId)
            .gte("start_time", lastWeek)
            .order("start_time", { ascending: false });
        if (result.error) throw result.error;
        return result.data || [];
    });
}

export async function getSingleSessionService(
    sessionId: string,
): Promise<[ISession | null, Error | null]> {
    return safeExecute(async () => {
        const { data, error } = await supabase
            .from("sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (error) throw error;
        return data;
    });
}

export async function addSessionService(
    userId: string,
    newSession: CreateSessionDto,
): Promise<[ISession | null, Error | null]> {
    return safeExecute(async () => {
        const { data, error } = await supabase
            .from("sessions")
            .insert({
                ...newSession,
                user_id: userId,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
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
