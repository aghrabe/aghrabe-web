import { AuthError, OAuthResponse } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

import {
    AuthProviderError,
    BaseError,
    ERROR_MESSAGES,
} from "../lib/constants/authErrors";
import safeExecute from "../lib/utils/safeExecute";
import { IUser } from "../lib/types/auth";
import { ContextProviderProps } from "../lib/types/context";
import supabase from "../services/supabaseClient";
import ContextGenerator from "./ContextGenerator";

interface IAuthContext {
    user: IUser | null;
    isLoading: boolean;
    signInWithGoogle(): Promise<AuthProviderError | OAuthResponse | null>;
    login: (
        email: string,
        password: string,
    ) => Promise<AuthProviderError | void>;
    register: (
        email: string,
        password: string,
        passwordConfirm: string,
    ) => Promise<AuthProviderError | void>;
    logout: () => Promise<AuthProviderError | void>;
    getUser: () => Promise<void>;
}

const { Provider, useContextValue: useAuthContext } =
    ContextGenerator<IAuthContext>("AuthContext");

export default function AuthProvider({ children }: ContextProviderProps) {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    function normalizeAuthError(err: unknown): AuthProviderError {
        if (err instanceof AuthError) return err;
        return {
            message: ERROR_MESSAGES.NETWORK_REQUEST_FAILED,
            cause: err,
        } as BaseError;
    }

    const getUser = useCallback(async () => {
        setIsLoading(true);
        const [result, error] = await safeExecute(
            () => supabase.auth.getUser(),
            normalizeAuthError,
        );

        if (error || !result?.data?.user) {
            console.error("Error fetching user:", error);
            setUser(null);
        } else {
            setUser({
                id: result.data.user.id,
                email: result.data.user.email!,
            });
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(
                    session?.user
                        ? { id: session.user.id, email: session.user.email! }
                        : null,
                );
            },
        );

        return () => {
            try {
                authListener.subscription.unsubscribe();
            } catch (err) {
                console.error({
                    message: ERROR_MESSAGES.SUBSCRIPTION_FAILED,
                    cause: err,
                });
            }
        };
    }, [getUser]);

    async function signInWithGoogle(): Promise<
        AuthProviderError | OAuthResponse | null
    > {
        const [result, error] = await safeExecute(
            () =>
                supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: `${window.location.origin}/`,
                    },
                }),
            normalizeAuthError,
        );

        if (error) {
            return error;
        }
        return result;
    }

    async function login(
        email: string,
        password: string,
    ): Promise<AuthProviderError | void> {
        const [result, error] = await safeExecute(
            () => supabase.auth.signInWithPassword({ email, password }),
            normalizeAuthError,
        );

        if (error || (result && result.error)) {
            const err = error || result!.error;
            return err!;
        }

        await getUser();
    }

    async function register(
        email: string,
        password: string,
        passwordConfirm: string,
    ): Promise<AuthProviderError | void> {
        if (password !== passwordConfirm) {
            return { message: ERROR_MESSAGES.PASSWORD_MISMATCH } as BaseError;
        }

        const [result, error] = await safeExecute(
            () =>
                supabase.auth.signUp({
                    email,
                    password,
                }),
            normalizeAuthError,
        );

        if (error || (result && result.error)) {
            const err = error || result!.error;
            return err!;
        }

        await getUser();
    }

    async function logout(): Promise<AuthProviderError | void> {
        const [error] = await safeExecute(
            () => supabase.auth.signOut(),
            normalizeAuthError,
        );

        if (error) {
            return {
                message: ERROR_MESSAGES.LOGOUT_FAILED,
                cause: error,
            } as BaseError;
        }
        setUser(null);
    }

    return (
        <Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                getUser,
                signInWithGoogle,
            }}
        >
            {children}
        </Provider>
    );
}

export { useAuthContext };
