import { OAuthResponse } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import {
    AuthProviderError,
    BaseError,
    ERROR_MESSAGES,
} from "../lib/constants/authErrors";
import { IUser } from "../lib/types/auth";
import { ContextProviderProps } from "../lib/types/context";
import {
    getUserService,
    loginService,
    logoutService,
    registerService,
    signInWithGoogleService,
} from "../services/authService";
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

    const getUser = useCallback(async () => {
        setIsLoading(true);
        const [result, error] = await getUserService();
        if (error || !result) {
            console.error("Error fetching user:", error);
            setUser(null);
        } else {
            setUser(result);
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
        const [result, error] = await signInWithGoogleService();
        if (error) {
            return error;
        }
        return result;
    }

    async function login(
        email: string,
        password: string,
    ): Promise<AuthProviderError | void> {
        const [, error] = await loginService(email, password);
        if (error) {
            return error;
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
        const [, error] = await registerService(email, password);
        if (error) {
            return error;
        }
        await getUser();
    }

    async function logout(): Promise<AuthProviderError | void> {
        const [, error] = await logoutService();
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
