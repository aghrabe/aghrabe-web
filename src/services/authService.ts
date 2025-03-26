import { AuthError, OAuthResponse } from "@supabase/supabase-js";
import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import { ERROR_MESSAGES, BaseError } from "../lib/constants/authErrors";
import { IUser } from "../lib/types/auth";

function normalizeAuthError(err: unknown): BaseError {
    if (err instanceof AuthError) return err;
    return {
        message: ERROR_MESSAGES.NETWORK_REQUEST_FAILED,
        cause: err,
    } as BaseError;
}

export async function getUserService(): Promise<
    [IUser | null, BaseError | null]
> {
    return await safeExecute(async () => {
        const result = await supabase.auth.getUser();
        if (!result?.data?.user) {
            throw new Error("No user found");
        }
        return {
            id: result.data.user.id,
            email: result.data.user.email!,
        } as IUser;
    }, normalizeAuthError);
}

export async function signInWithGoogleService(): Promise<
    [OAuthResponse | null, BaseError | null]
> {
    return await safeExecute(
        () =>
            supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            }),
        normalizeAuthError,
    );
}

export async function loginService(
    email: string,
    password: string,
): Promise<[void | null, BaseError | null]> {
    return await safeExecute(async () => {
        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (result.error) throw result.error;
        return;
    }, normalizeAuthError);
}

export async function registerService(
    email: string,
    password: string,
): Promise<[void | null, BaseError | null]> {
    return await safeExecute(async () => {
        const result = await supabase.auth.signUp({
            email,
            password,
        });
        if (result.error) throw result.error;
        return;
    }, normalizeAuthError);
}

export async function logoutService(): Promise<
    [void | null, BaseError | null]
> {
    return await safeExecute(async () => {
        const result = await supabase.auth.signOut();
        if (result.error) throw result.error;
        return;
    }, normalizeAuthError);
}
