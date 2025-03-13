import { useCallback, useEffect, useState } from "react";
import { AuthError } from "@supabase/supabase-js";

import {
    AuthProviderError,
    BaseError,
    ERROR_MESSAGES,
} from "../lib/constants/authErrors";
import safeExecute from "../lib/safeExecute";
import supabase from "../services/supabaseClient";
import { User } from "../lib/types/auth";
import { ContextProviderProps } from "../lib/types/context";
import ContextGenerator from "./ContextGenerator";

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
            message: ERROR_MESSAGES.NETWORK_REQUEST_FAILED,
            cause: err,
        } as BaseError;
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
                    message: ERROR_MESSAGES.SUBSCRIPTION_FAILED,
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
