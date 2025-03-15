import { useCallback, useState } from "react";

import safeExecute from "../lib/safeExecute";
import supabase from "../services/supabaseClient";
import { ISettings } from "../lib/types/settings";
import useQuery from "./useQuery";
import { useAuthContext } from "../context/AuthContext";

export default function useSettings() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSettings = useCallback(async (): Promise<ISettings> => {
        const [data, error] = await safeExecute<ISettings, Error>(
            async () => {
                const result = await supabase
                    .from("settings")
                    .select("*")
                    .eq("user_id", user?.id)
                    .maybeSingle();

                // throw result.error letting safeExecute catch it
                if (result.error) {
                    throw result.error;
                }
                return result.data;
            },
            // INFO: we can write a custom error normalizer
        );

        // TODO: seperate settings and profile errors
        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

    const { state: settingsState, refetch } = useQuery<ISettings>(
        `settings.${user?.id}`,
        getSettings,
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

    return { settingsState, errorMessage, updateSettings };
}
