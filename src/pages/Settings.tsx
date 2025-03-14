import { useCallback, useState } from "react";

import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthContext } from "../context/AuthContext";
import useQuery from "../hooks/useQuery";
import safeExecute from "../lib/safeExecute";
import { IProfile } from "../lib/types/profile";
import { ISettings } from "../lib/types/settings";
import supabase from "../services/supabaseClient";

export default function Settings() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getProfileData = useCallback(async (): Promise<IProfile> => {
        const [data, error] = await safeExecute<IProfile, Error>(
            async () => {
                const result = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user?.id)
                    .single();

                // throw result.error letting safeExecute catch it
                if (result.error) {
                    throw result.error;
                }
                return result.data;
            },
            // INFO: we can write a custom error normalizer
        );

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

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

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

    const { state: profileState } = useQuery<IProfile>(
        `profile.${user?.id}`,
        getProfileData,
    );

    const { state: settingsState } = useQuery<ISettings>(
        `settings.${user?.id}`,
        getSettings,
    );

    return (
        <>
            <Header header={"Settings"}></Header>
            {errorMessage && (
                <p className={"text-xl text-error"}>{errorMessage}</p>
            )}
            {profileState.isLoading ? (
                <LoadingSpinner />
            ) : (
                <p>{profileState.data?.email}</p>
            )}
            {settingsState.isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <p>
                        Daily limit: {settingsState.data?.daily_limit_minutes}
                    </p>
                    <p>
                        Session limit:{" "}
                        {settingsState.data?.session_limit_minutes}
                    </p>
                </>
            )}
        </>
    );
}
