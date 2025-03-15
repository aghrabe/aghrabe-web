import { useCallback, useState } from "react";
import { IProfile } from "../lib/types/profile";
import safeExecute from "../lib/safeExecute";
import supabase from "../services/supabaseClient";
import useQuery from "./useQuery";
import { useAuthContext } from "../context/AuthContext";

export default function useProfile() {
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

    const { state: profileState } = useQuery<IProfile>(
        `profile.${user?.id}`,
        getProfileData,
    );

    return { profileState, errorMessage };
}
