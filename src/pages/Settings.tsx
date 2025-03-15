import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import useProfile from "../hooks/useProfile";
import useSettings from "../hooks/useSettings";

export default function Settings() {
    const { profileState, errorMessage: profileErrorMessage } = useProfile();
    const { settingsState, errorMessage: settingsErrorMessage } = useSettings();

    return (
        <>
            <Header header={"Settings"}></Header>
            {profileErrorMessage && (
                <p className={"text-xl text-error"}>{profileErrorMessage}</p>
            )}
            {settingsErrorMessage && (
                <p className={"text-xl text-error"}>{settingsErrorMessage}</p>
            )}
            {profileState.isLoading || settingsState.isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <p>{profileState.data?.email}</p>
                    <p>
                        Daily limit: {settingsState.data?.daily_limit_minutes}
                    </p>
                    <p>
                        Session limit:{" "}
                        {settingsState.data?.session_limit_minutes}
                    </p>
                    <p>
                        Break duration:{" "}
                        {settingsState.data?.break_duration_minutes}
                    </p>
                    <p>
                        Notifications enabled:{" "}
                        {`${settingsState.data?.notifications_enabled}`}
                    </p>
                </>
            )}
        </>
    );
}
