import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import { ISettings } from "../lib/types/settings";

export async function getSettingsService(
    userId: string,
): Promise<[ISettings | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("settings")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (result.error) throw result.error;

        if (!result.data) {
            const defaultSettings = { user_id: userId };
            const { error: insertError } = await supabase
                .from("settings")
                .insert(defaultSettings)
                .single();

            if (insertError) throw insertError;

            return defaultSettings;
        }

        return result.data;
    });
}

export async function updateSettingsService(
    userId: string,
    newSettings: Partial<ISettings>,
): Promise<[null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("settings")
            .update(newSettings)
            .eq("user_id", userId);
        if (result.error) throw result.error;
        return null;
    });
}
