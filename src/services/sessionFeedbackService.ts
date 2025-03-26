import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import {
    ISessionFeedback,
    NewSessionFeedbackDto,
} from "../lib/types/sessionFeedbacks";

export async function getSessionFeedbacksService(
    userId: string,
    sessionId?: string,
): Promise<[Array<ISessionFeedback> | null, Error | null]> {
    return await safeExecute(async () => {
        let query = supabase
            .from("session_feedbacks")
            .select("*")
            .eq("user_id", userId);

        if (sessionId) {
            query = query.eq("session_id", sessionId);
        }

        const result = await query.order("created_at", { ascending: false });
        if (result.error) throw result.error;
        return result.data || [];
    });
}

export async function addSessionFeedbackService(
    newFeedback: NewSessionFeedbackDto,
): Promise<[void | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("session_feedbacks")
            .insert(newFeedback)
            .single();
        if (result.error) throw result.error;
        return;
    });
}
