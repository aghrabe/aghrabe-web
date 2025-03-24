import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "../components/Button";
import Header from "../components/Header";
import InputField from "../components/InputField";
import LoadingSpinner from "../components/LoadingSpinner";
import Switch from "../components/Switch";
import useProfile from "../hooks/useProfile";
import useSettings from "../hooks/useSettings";
import { settingsSchema, SettingsSchemaType } from "../lib/types/settings";
import ThemeSelector from "../components/ThemeSelector";
import { useBreakpoint } from "../context/BreakpointContext";
import { TAILWIND_BREAKPOINTS } from "../lib/constants/tailwind";

export default function Settings() {
    const { profileState, errorMessage: profileErrorMessage } = useProfile();
    const {
        settingsState,
        errorMessage: settingsErrorMessage,
        updateSettings,
    } = useSettings();
    const { width } = useBreakpoint();

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
    }

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
                        "text-on-background px-2 py-6 md:p-6 space-y-6 text-base md:text-xl "
                    }
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className={"space-y-1"}>
                        <label className={"block font-medium"}>Email</label>
                        <p className={""}>{profileState.data?.email}</p>
                    </div>

                    <InputField
                        id={"daily-limit"}
                        type={"number"}
                        label={"Daily Limit (minutes)"}
                        placeholder={"Enter daily limit"}
                        {...register("daily_limit_minutes", {
                            valueAsNumber: true,
                        })}
                        error={errors.daily_limit_minutes?.message}
                    />
                    <InputField
                        id={"session-limit"}
                        type={"number"}
                        label={"Session Limit (minutes)"}
                        placeholder={"Enter session limit"}
                        {...register("session_limit_minutes", {
                            valueAsNumber: true,
                        })}
                        error={errors.session_limit_minutes?.message}
                    />
                    <InputField
                        id={"break-duration"}
                        type={"number"}
                        label={"Break Duration (minutes)"}
                        placeholder={"Enter break duration"}
                        {...register("break_duration_minutes", {
                            valueAsNumber: true,
                        })}
                        error={errors.break_duration_minutes?.message}
                    />

                    <div className={"col-span-2 space-y-1"}>
                        <label className={"block font-medium"}>Theme</label>
                        <ThemeSelector />
                    </div>

                    <div className={"flex items-center justify-between"}>
                        <label className={"block font-medium"}>
                            Notifications
                        </label>
                        <Switch
                            checked={watch("notifications_enabled")}
                            onChange={(checked) =>
                                setValue("notifications_enabled", checked)
                            }
                            size={"medium"}
                        />
                    </div>

                    <div className={"flex gap-4"}>
                        <Button
                            type={"submit"}
                            variant={"contained"}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            size={
                                width < TAILWIND_BREAKPOINTS.md
                                    ? "small"
                                    : "medium"
                            }
                            fullWidth
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            )}
        </>
    );
}
