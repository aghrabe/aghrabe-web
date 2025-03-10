import { RecordModel } from "pocketbase";
import { z } from "zod";

export type AuthType = "register" | "login";

const errorMessages = {
    required: (label: string) => `${label} is required.`,
    invalid: (label: string, hint?: string) => `${label} is Invalid. ${hint}`,
    min: (label: string, minHint: number) =>
        `${label} must be at least ${minHint} characters long.`,
    max: (label: string, maxHint: number) =>
        `${label} must be maximum ${maxHint} characters long.`,
};

export const loginSchema = z.object({
    email: z
        .string({
            required_error: errorMessages.required("Email"),
            invalid_type_error: errorMessages.invalid("Email"),
        })
        .email({ message: "Invalid email address" }),
    password: z
        .string({
            required_error: errorMessages.required("Password"),
            invalid_type_error: errorMessages.invalid("Password"),
        })
        .min(6, {
            message: errorMessages.min("Password", 6),
        }),
});

export const registerSchema = loginSchema
    .extend({
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;

export interface User extends RecordModel {
    id: string;
    email: string;
    password: string;
    username: string;
    avatar?: string;
    settings_id: string;
}
