import { useCallback, useEffect, useState } from "react";

import { AuthError } from "@supabase/supabase-js";
import safeExecute from "../lib/safeExecute";
import supabase from "../services/supabaseClient";
import { User } from "../types/auth";
import { ContextProviderProps } from "../types/context";
import ContextGenerator from "./ContextGenerator";

interface PasswordMismatchError {
    message: "Passwords do not match";
}
interface LogoutError {
    message: "Logging out failed!";
    cause?: unknown;
}
interface NetworkError {
    message: "Network request failed";
    cause?: unknown;
}
interface StateUpdateError {
    message: "Attempted to update state after component unmount";
}
interface SubscriptionError {
    message: "Failed to set up auth listener";
    cause?: unknown;
}

type AuthProviderError =
    | AuthError
    | PasswordMismatchError
    | StateUpdateError
    | LogoutError
    | NetworkError
    | SubscriptionError;

interface IAuthContext {
    user: User | null;
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

// TODO: instead of logging certain errors return them to the consumer so they decide what to do with them
export default function AuthProvider({ children }: ContextProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    function normalizeAuthError(err: unknown): AuthProviderError {
        if (err instanceof AuthError) return err;
        return {
            message: "Network request failed",
            cause: err,
        } as NetworkError;
    }

    const getUser = useCallback(async () => {
        const [result, error] = await safeExecute(
            () => supabase.auth.getUser(),
            normalizeAuthError,
        );

        if (error || !result?.data?.user) {
            console.error("Error fetching user:", error);
            setUser(null);
            return;
        }
        setUser({
            id: result.data.user.id,
            email: result.data.user.email!,
        });
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
                    message: "Failed to clean up auth listener",
                    cause: err,
                });
            }
        };
    }, [getUser]);

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
            console.error("Login error:", err);
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
            return {
                message: "Passwords do not match",
            } as PasswordMismatchError;
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
                message: "Logging out failed!",
                cause: error,
            } as LogoutError;
        }
        setUser(null);
    }

    return (
        <Provider
            value={{
                user,
                login,
                register,
                logout,
                getUser,
            }}
        >
            {children}
        </Provider>
    );
}

export { useAuthContext };
