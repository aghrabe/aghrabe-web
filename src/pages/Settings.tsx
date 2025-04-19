import { zodResolver } from "@hookform/resolvers/zod";
import {
    Bell,
    Clock,
    Coffee,
    LogOut,
    Mail,
    Palette,
    Save,
    Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Header from "../components/Header";
import InputField from "../components/InputField";
import LoadingSpinner from "../components/LoadingSpinner";
import LogoutModal from "../components/Modals/LogoutModal";
import Switch from "../components/Switch";
import ThemeSelector from "../components/ThemeSelector";
import { useAuthContext } from "../context/AuthContext";
import { useBreakpoint } from "../context/BreakpointContext";
import { useCurrentSession } from "../context/CurrentSessionContext";
import useProfile from "../hooks/useProfile";
import useSettings from "../hooks/useSettings";
import { settingsSchema, type SettingsSchemaType } from "../lib/types/settings";

export default function Settings() {
    const { logout } = useAuthContext();
    const { profileState, errorMessage: profileErrorMessage } = useProfile();
    const {
        settingsState,
        errorMessage: settingsErrorMessage,
        updateSettings,
    } = useSettings();
    const { isMobile } = useBreakpoint();
    const { setSettingsShouldChange } = useCurrentSession();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const iconSize = isMobile ? 18 : 20;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SettingsSchemaType>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            daily_limit_minutes: 100,
            session_limit_minutes: 50,
            break_duration_minutes: 5,
            notifications_enabled: true,
        },
    });

    // reset form when settings are fetched
    useEffect(() => {
        if (settingsState.data) {
            reset(settingsState.data);
        }
    }, [settingsState.data, reset]);

    async function onSubmit(data: SettingsSchemaType) {
        await updateSettings(data);
        setSettingsShouldChange(true);
    }

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(false);
        logout();
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <Header header={"Settings"} />
            {profileErrorMessage && (
                <p className={"text-lg md:text-xl text-error"}>
                    {profileErrorMessage}
                </p>
            )}
            {settingsErrorMessage && (
                <p className={"text-lg md:text-xl text-error"}>
                    {settingsErrorMessage}
                </p>
            )}
            {profileState.isLoading || settingsState.isLoading ? (
                <LoadingSpinner />
            ) : (
                <form
                    className={
                        "text-on-background px-2 py-6 md:p-6 space-y-4 md:space-y-6 text-base md:text-xl "
                    }
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className={"flex justify-between items-end"}>
                        <div className={"space-y-1"}>
                            <label
                                className={
                                    "font-medium flex items-center gap-2"
                                }
                            >
                                <Mail size={iconSize} />
                                Email
                            </label>
                            <p className={""}>{profileState.data?.email}</p>
                        </div>
                        <button
                            type={"button"}
                            onClick={handleLogoutClick}
                            className={
                                "p-2 rounded-md transition-colors cursor-pointer text-error border border-error hover:bg-error-container"
                            }
                            aria-label={"Logout Button"}
                        >
                            <LogOut size={iconSize - 2} />
                        </button>
                    </div>

                    <InputField
                        id={"daily-limit"}
                        type={"number"}
                        label={
                            <span className={"flex items-center gap-2"}>
                                <Clock size={iconSize} />
                                Daily Limit (minutes)
                            </span>
                        }
                        placeholder={"Enter daily limit"}
                        {...register("daily_limit_minutes", {
                            valueAsNumber: true,
                        })}
                        error={errors.daily_limit_minutes?.message}
                    />
                    <InputField
                        id={"session-limit"}
                        type={"number"}
                        label={
                            <span className={"flex items-center gap-2"}>
                                <Timer size={iconSize} />
                                Session Limit (minutes)
                            </span>
                        }
                        placeholder={"Enter session limit"}
                        {...register("session_limit_minutes", {
                            valueAsNumber: true,
                        })}
                        error={errors.session_limit_minutes?.message}
                    />
                    <InputField
                        id={"break-duration"}
                        type={"number"}
                        label={
                            <span className={"flex items-center gap-2"}>
                                <Coffee size={iconSize} />
                                Break Duration (minutes)
                            </span>
                        }
                        placeholder={"Enter break duration"}
                        {...register("break_duration_minutes", {
                            valueAsNumber: true,
                        })}
                        error={errors.break_duration_minutes?.message}
                    />

                    <div className={"col-span-2 space-y-1"}>
                        <label
                            className={"font-medium flex items-center gap-2"}
                        >
                            <Palette size={iconSize} />
                            Theme
                        </label>
                        <ThemeSelector />
                    </div>

                    <div className={"flex items-center justify-between"}>
                        <label
                            className={"font-medium flex items-center gap-2"}
                        >
                            <Bell size={iconSize} />
                            Notifications
                        </label>
                        <Switch
                            checked={watch("notifications_enabled")}
                            onChange={(checked) =>
                                setValue("notifications_enabled", checked)
                            }
                            size={isMobile ? "medium" : "large"}
                        />
                    </div>

                    <div className={"flex flex-col gap-4"}>
                        <Button
                            type={"submit"}
                            variant={"contained"}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            size={isMobile ? "small" : "medium"}
                            className={"flex items-center gap-1"}
                            fullWidth
                        >
                            <Save size={iconSize - 2} />
                            Save Changes
                        </Button>

                        {/*
                        <Button
                            type={"button"}
                            variant={"outlined"}
                            color={"error"}
                            onClick={handleLogoutClick}
                            size={isMobile ? "small" : "medium"}
                            className={"flex items-center gap-1"}
                        >
                            <LogOut size={iconSize - 2} />
                            Logout
                        </Button>
                            */}
                    </div>
                </form>
            )}

            {isLogoutModalOpen && (
                <LogoutModal
                    onClose={closeLogoutModal}
                    onLogout={handleLogout}
                />
            )}
        </>
    );
}
