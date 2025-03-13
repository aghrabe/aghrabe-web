import { AuthError } from "@supabase/supabase-js";

export const ERROR_MESSAGES = {
    PASSWORD_MISMATCH: "Passwords do not match",
    LOGOUT_FAILED: "Logging out failed!",
    NETWORK_REQUEST_FAILED: "Network request failed",
    STATE_UPDATE: "Attempted to update state after component unmount",
    SUBSCRIPTION_FAILED: "Failed to set up auth listener",
} as const;

export interface BaseError {
    message: string;
    cause?: unknown;
}

export type AuthProviderError = AuthError | BaseError;
