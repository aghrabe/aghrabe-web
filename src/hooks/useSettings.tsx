import { useCallback, useState } from "react";

import { useAuthContext } from "../context/AuthContext";
import safeExecute from "../lib/safeExecute";
import { ISettings } from "../lib/types/settings";
import supabase from "../services/supabaseClient";
import useQuery from "./useQuery";

export default function useSettings() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSettings = useCallback(async (): Promise<ISettings> => {
        const [data, error] = await safeExecute<ISettings, Error>(async () => {
            const result = await supabase
                .from("settings")
                .select("*")
                .eq("user_id", user?.id)
                .maybeSingle();

            if (result.error) throw result.error;

            if (!result.data) {
                const { error: insertError } = await supabase
                    .from("settings")
                    .insert({
                        user_id: user?.id,
                    })
                    .single();

                if (insertError) throw insertError;

                return {
                    user_id: user?.id,
                };
            }

            return result.data;
        });

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

    const { state: settingsState, refetch } = useQuery<ISettings>(
        `settings.${user?.id}`,
        getSettings,
        30 * 60 * 1000, // 30 min
    );

    const updateSettings = useCallback(
        async (newSettings: Partial<ISettings>): Promise<void> => {
            if (!user?.id) return;

            const [, error] = await safeExecute<void, Error>(async () => {
                const result = await supabase
                    .from("settings")
                    .update(newSettings)
                    .eq("user_id", user.id);

                if (result.error) {
                    throw result.error;
                }
            });

            if (error) {
                setErrorMessage(error.message);
            }
            refetch(true);
        },
        [refetch, user?.id],
    );

    return {
        settingsState,
        errorMessage,
        updateSettings,
    };
}
