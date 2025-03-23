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
        const [data, error] = await safeExecute<IProfile, Error>(async () => {
            const result = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user?.id)
                .single();

            if (result.error && result.error.code !== "PGRST116") {
                // 'PGRST116' means no data found
                throw result.error;
            }

            if (!result.data) {
                const { error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        id: user?.id,
                        email: user?.email,
                        display_name: user?.email?.split("@")[0],
                    })
                    .single();

                if (insertError) throw insertError;

                return {
                    id: user?.id,
                    email: user?.email,
                    display_name: user?.email?.split("@")[0],
                };
            }

            return result.data;
        });

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id, user?.email]);

    const { state: profileState } = useQuery<IProfile>(
        `profile.${user?.id}`,
        getProfileData,
        30 * 60 * 1000, // 30 min
    );

    return { profileState, errorMessage };
}
