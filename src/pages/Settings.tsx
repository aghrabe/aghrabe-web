import { useCallback, useState } from "react";

import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthContext } from "../context/AuthContext";
import useQuery from "../hooks/useQuery";
import safeExecute from "../lib/safeExecute";
import { Profile } from "../lib/types/auth";
import supabase from "../services/supabaseClient";

export default function Settings() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getProfileData = useCallback(async (): Promise<Profile> => {
        const [data, error] = await safeExecute<Profile, Error>(async () => {
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
        });

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

    const { state } = useQuery<Profile>(`profile.${user?.id}`, getProfileData);

    return (
        <>
            <Header header={"Settings"}></Header>
            {errorMessage && (
                <p className={"text-xl text-error"}>{errorMessage}</p>
            )}
            {state.isLoading ? <LoadingSpinner /> : <p>{state.data?.email}</p>}
        </>
    );
}
