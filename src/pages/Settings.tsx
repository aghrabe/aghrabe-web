import { useCallback, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthContext } from "../context/AuthContext";
import useQuery from "../hooks/useQuery";
import { Profile } from "../lib/types/auth";
import supabase from "../services/supabaseClient";

export default function Settings() {
    const { user } = useAuthContext();

    const getProfileData = useCallback(async (): Promise<Profile> => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user?.id)
            .single();

        if (error) {
            throw error;
        }
        return data;
    }, [user?.id]);

    const { state } = useQuery<Profile>(`profile.${user?.id}`, getProfileData);

    useEffect(() => {
        console.log("auth.user: ", user);
        console.log("public.profile: ", state.data);
    }, [user, state.data]);

    return (
        <>
            <div className={"text-2xl font-bold"}>Settings</div>
            {state.isLoading ? <LoadingSpinner /> : <p>{state.data?.email}</p>}
        </>
    );
}
