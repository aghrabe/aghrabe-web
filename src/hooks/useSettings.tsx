import { useCallback, useState } from "react";
import { ISettings } from "../lib/types/settings";
import useQuery from "./useQuery";
import { useAuthContext } from "../context/AuthContext";
import {
    getSettingsService,
    updateSettingsService,
} from "../services/settingsService";

export default function useSettings() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSettings = useCallback(async (): Promise<ISettings> => {
        if (!user?.id) throw new Error("User is not authenticated");

        const [data, error] = await getSettingsService(user.id);
        if (error) {
            setErrorMessage(error.message);
            return {} as ISettings;
        }

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

            const [, error] = await updateSettingsService(user.id, newSettings);
            if (error) {
                setErrorMessage(error.message);
            } else {
                refetch(true);
            }
        },
        [refetch, user?.id],
    );

    return {
        settingsState,
        errorMessage,
        updateSettings,
        refetch,
    };
}
