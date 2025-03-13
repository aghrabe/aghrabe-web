import { useEffect, useState } from "react";

import supabase from "../services/supabaseClient";
import { User } from "../types/auth";
import { ContextProviderProps } from "../types/context";
import ContextGenerator from "./ContextGenerator";

interface IAuthContext {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        passwordConfirm: string,
    ) => Promise<void>;
    logout: () => void;
}

const { Provider, useContextValue: useAuthContext } =
    ContextGenerator<IAuthContext>("AuthContext");

export default function AuthProvider({ children }: ContextProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    async function getUser() {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            setUser(null);
            return;
        }

        setUser({
            id: data.user.id,
            email: data.user.email!,
        });
    }

    useEffect(() => {
        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!session?.user) {
                    setUser(null);
                    return;
                }
                await getUser();
            },
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    async function login(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // TODO: maybe a global error handler to show notifications if needed
        if (error) throw error;

        await getUser();
    }

    async function register(
        email: string,
        password: string,
        passwordConfirm: string,
    ) {
        if (password !== passwordConfirm) {
            throw new Error("Passwords do not match");
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        // TODO: refactor
        if (error) throw error;

        await getUser();
    }

    async function logout() {
        await supabase.auth.signOut();
        setUser(null);
    }

    return (
        <Provider
            value={{
                user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </Provider>
    );
}

export { useAuthContext };
