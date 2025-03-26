import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import { IProfile } from "../lib/types/profile";

export async function getProfileDataService(
    userId: string,
    email: string | null,
): Promise<[IProfile | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (result.error && result.error.code !== "PGRST116") {
            throw result.error; // 'PGRST116' means no data found
        }

        if (!result.data) {
            const newProfile = {
                id: userId,
                email,
                display_name: email?.split("@")[0] || "Unknown",
            };

            const { error: insertError } = await supabase
                .from("profiles")
                .insert(newProfile)
                .single();

            if (insertError) throw insertError;

            return newProfile;
        }

        return result.data;
    });
}
