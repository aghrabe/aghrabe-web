import { useCallback, useState } from "react";
import { IProfile } from "../lib/types/profile";
import useQuery from "./useQuery";
import { useAuthContext } from "../context/AuthContext";
import { getProfileDataService } from "../services/profileService";

export default function useProfile() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getProfileData = useCallback(async (): Promise<IProfile> => {
        if (!user?.id) throw new Error("User is not authenticated");

        const [data, error] = await getProfileDataService(user.id, user.email);
        if (error) {
            setErrorMessage(error.message);
            return {} as IProfile;
        }

        return data!;
    }, [user?.id, user?.email]);

    const { state: profileState } = useQuery<IProfile>(
        `profile.${user?.id}`,
        getProfileData,
        30 * 60 * 1000, // 30 min
    );

    return { profileState, errorMessage };
}
