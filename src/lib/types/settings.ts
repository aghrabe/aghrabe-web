import { z } from "zod";

export const settingsSchema = z.object({
    daily_limit_minutes: z
        .number({ invalid_type_error: "Must be a number" })
        .min(1, "Must be at least 1 minute"),
    session_limit_minutes: z
        .number({ invalid_type_error: "Must be a number" })
        .min(1, "Must be at least 1 minute"),
    break_duration_minutes: z
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Break duration cannot be negative"),
    notifications_enabled: z.boolean(),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;

export interface ISettings {
    id: string;
    user_id: string;
    daily_limit_minutes: number;
    session_limit_minutes: number;
    break_duration_minutes: number;
    notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}
